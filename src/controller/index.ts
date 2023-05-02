import { Request, Response } from "express";
import { getNews } from "../utils/getNews";
import { TWITTER_APP_KEY, TWITTER_APP_KEY_SECRET, NEWS_API_KEY, PORT } from "../../config/index";
import { filterUniqueNews, pickFirstNNews } from "../utils/utils";
import { generateChatGPTPromptForNewsLetter, generateChatGPTPromptForTwitter } from "../utils/generateChatGPTPrompt";
import { generateContentWithGPT } from "../utils/generateContentWithGPT";
import { generateImage, generateImagePrompt } from "../utils/generateImage";
import { sendMail } from "../utils/sendMail";
// import { postOnTwitter } from "../utils/postOnSocialMedia";
import { URL } from "url";
import Twitter from "twitter-lite";
import { socketServer } from "..";

interface NewsPost {
    news: string;
    emails: string[];
    from: string;
    to: string;
    postToTwitter: boolean;
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
        const { news, emails, to, from, oauth_token, oauth_verifier, postToTwitter, socketId } = req.body;
        res.status(200).json({
            success: true,
            socketId,
            message: "Your request has been initiated...",
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
        let twitterUrl: string = "";
        if (postToTwitter && !!oauth_token && !!oauth_verifier) {
            // const promptForLinkedIn = generateChatGPTPromptForLinkedIn(gptResponse);
            const promptForTwitter = generateChatGPTPromptForTwitter(gptResponse);

            // const gptResponseLinkedIn = await generateContentWithGPT(promptForLinkedIn);
            const gptResponseTwitter = await generateContentWithGPT(promptForTwitter);

            // console.log("\n\nLinkedIn\n\n", gptResponseLinkedIn.choices[0].message.content);
            console.log("\n\nTwitter\n\n", gptResponseTwitter);
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
            const tweetText = gptResponseTwitter;
            const twitterUser = await userClient.post("statuses/update", { status: tweetText });
            twitterUrl = `https://twitter.com/${twitterUser.user.screen_name}/status/${twitterUser.id_str}`;
        }
        socketServer.automatedNewsLetterResponse(socketId, {
            success: true,
            twitterUrl,
            message: "NewsLetter successfully sent...",
        });
    } catch (error) {
        const { socketId } = req.body;
        console.log("Error showing", error);
        socketServer.automatedNewsLetterFailure(socketId, {
            success: false,
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
        const twitterToken = await twitterClient.getRequestToken("http://192.168.0.205:3000/twitter-auth");
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
