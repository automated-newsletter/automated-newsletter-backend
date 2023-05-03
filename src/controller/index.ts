import { Request, Response } from "express";
import { getNews } from "../utils/getNews";
import {
    TWITTER_APP_KEY,
    TWITTER_APP_KEY_SECRET,
    NEWS_API_KEY,
    PORT,
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET_ID,
    CLIENT_DOMAIN,
} from "../config/index";
import { filterUniqueNews, pickFirstNNews } from "../utils/utils";
import {
    generateChatGPTPromptForLinkedIn,
    generateChatGPTPromptForNewsLetter,
    generateChatGPTPromptForTwitter,
} from "../utils/generateChatGPTPrompt";
import { generateContentWithGPT } from "../utils/generateContentWithGPT";
import { generateImage, generateImagePrompt } from "../utils/generateImage";
import { sendMail } from "../utils/sendMail";
import { URL } from "url";
import Twitter from "twitter-lite";
import { socketServer } from "..";
import { ResponseStatus, SupportedPlatforms, SocialMediaSupport } from "../socket/type";
import { generateTwitterSummary } from "../utils/postOnSocialMedia";
import axios from "axios";

export interface NewsPost {
    news: string;
    emails: string[];
    from: string;
    to: string;
    postToTwitter: boolean;
    postToLinkedIn: boolean;
    linkedInAuthCode?: string;
    socketId: string;
    oauth_token?: string;
    oauth_verifier?: string;
}

const twitterClient = new Twitter({
    consumer_key: TWITTER_APP_KEY,
    consumer_secret: TWITTER_APP_KEY_SECRET,
    version: "1.1",
});

export const newAutomatedLetter = async (req: Request<{}, {}, NewsPost>, res: Response) => {
    try {
        const {
            news,
            emails,
            to,
            from,
            oauth_token,
            oauth_verifier,
            postToTwitter,
            socketId,
            postToLinkedIn,
            linkedInAuthCode,
        } = req.body;
        res.status(200).json({
            status: ResponseStatus.PENDING,
            socketId,
            message: "Your request has been initiated, You will be informed once your request is completed...",
        });
        const newsData = await getNews(news, from, to, NEWS_API_KEY);
        console.log("news", newsData);
        const uniqueNewsData = filterUniqueNews(newsData.articles, "title");
        console.log("uniqueNews", uniqueNewsData);
        const uniqueNews = pickFirstNNews(uniqueNewsData, 5);
        console.log("uniqueNews", uniqueNews);
        const prompt = generateChatGPTPromptForNewsLetter(uniqueNews);
        console.log("prompt", prompt);
        const gptResponse = await generateContentWithGPT(prompt);
        console.log("gptResponse", gptResponse);
        console.log("news", uniqueNews);

        const imagePrompt = generateImagePrompt(gptResponse);
        const imagePromptGPT = await generateContentWithGPT(imagePrompt);
        console.log("imagePrompt", imagePromptGPT);

        const imageResponse = await generateImage(imagePromptGPT);

        console.log("Summary\n\n", gptResponse);
        console.log("image", imageResponse);

        const newsStringModifier = news.replaceAll(" OR", ",");

        await sendMail(emails, imageResponse, gptResponse, uniqueNews, newsStringModifier);
        let socialMediaUrls: SocialMediaSupport[] = [];
        if (postToTwitter && !!oauth_token && !!oauth_verifier) {
            const tweet = await generateTwitterSummary(gptResponse);

            // console.log("\n\nLinkedIn\n\n", gptResponseLinkedIn.choices[0].message.content);
            console.log("\n\nTwitter\n\n", tweet);
            const { oauth_token: accessToken, oauth_token_secret: accessSecret } = await twitterClient.getAccessToken({
                oauth_verifier,
                oauth_token,
            });

            // Use the user's access tokens to post a tweet on their behalf
            const userClient = new Twitter({
                consumer_key: TWITTER_APP_KEY,
                consumer_secret: TWITTER_APP_KEY_SECRET,
                access_token_key: accessToken,
                access_token_secret: accessSecret,
                version: "1.1",
            });
            const tweetText = tweet;
            const twitterUser = await userClient.post("statuses/update", { status: tweetText });
            console.log("twitterUser", twitterUser);
            socialMediaUrls.push({
                platform: SupportedPlatforms.TWITTER,
                url: `https://twitter.com/${twitterUser.user.screen_name}/status/${twitterUser.id_str}`,
            });
        }
        if (postToLinkedIn && !!linkedInAuthCode) {
            const promptForLinkedIn = generateChatGPTPromptForLinkedIn(gptResponse);
            const gptResponseLinkedIn = await generateContentWithGPT(promptForLinkedIn);
            const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
                params: {
                    grant_type: "authorization_code",
                    code: linkedInAuthCode,
                    redirect_uri: `${CLIENT_DOMAIN}/linkedin-auth`,
                    client_id: LINKEDIN_CLIENT_ID,
                    client_secret: LINKEDIN_CLIENT_SECRET_ID,
                },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const access_token = tokenResponse.data.access_token;

            const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            });

            const authorId = profileResponse.data.id;

            const shareContent = {
                author: `urn:li:person:${authorId}`,
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: gptResponseLinkedIn,
                        },
                        shareMediaCategory: "NONE",
                    },
                },
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
                },
            };

            const linkedInPostResponse = await axios.post("https://api.linkedin.com/v2/ugcPosts", shareContent, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            });

            socialMediaUrls.push({
                platform: SupportedPlatforms.LINKEDIN,
                url: `https://www.linkedin.com/feed/update/${linkedInPostResponse.data.id}/`,
            });

            console.log("shareResponse", linkedInPostResponse.data.id);
        }
        socketServer.automatedNewsLetterResponse(socketId, {
            status: ResponseStatus.SUCCESS,
            socialMediaUrls,
            message: "NewsLetter successfully sent...",
        });
    } catch (error) {
        const { socketId } = req.body;
        console.log("Error showing", error);
        socketServer.automatedNewsLetterFailure(socketId, {
            status: ResponseStatus.FAILED,
            message: "Failed to send newsletter",
        });
    }
};

export const callBackTwitter = async (req: Request<{}, {}>, res: Response) => {
    try {
        const oauthToken = req.query.oauth_token as string;
        const oauthVerifier = req.query.oauth_verifier as string;
        const { oauth_token: accessToken, oauth_token_secret: accessSecret } = await twitterClient.getAccessToken({
            oauth_verifier: oauthVerifier,
            oauth_token: oauthToken,
        });
        res.status(200).json({
            accessToken,
            accessSecret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred.");
    }
};

export const authorizeTwitter = async (req: Request<{}, {}>, res: Response) => {
    try {
        let oauthToken = "",
            oauthTokenSecret;
        const twitterToken = await twitterClient.getRequestToken(`${CLIENT_DOMAIN}/twitter-auth`);
        if (twitterToken.oauth_callback_confirmed === "true") {
            oauthToken = twitterToken.oauth_token;
            oauthTokenSecret = twitterToken.oauth_token_secret;
        }
        // Save the request token secret to compare later
        const authURL = new URL("https://api.twitter.com/oauth/authenticate");
        authURL.searchParams.append("oauth_token", oauthToken);
        // res.send(`<a href="${authURL.toString()}">Click here to authorize the app</a>`);
        res.status(200).json({ authURL: authURL.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred.");
    }
};

export const authorizeLinkedin = async (req: Request<{}, {}>, res: Response) => {
    try {
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            `${CLIENT_DOMAIN}/linkedin-auth`
        )}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
        res.status(200).json({ authURL: authUrl.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured linkedin authorize");
    }
};
