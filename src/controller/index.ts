import { Request, Response } from "express";
import { getNews } from "../utils/getNews";
import { TWITTER_APP_KEY, TWITTER_APP_KEY_SECRET, NEWS_API_KEY, PORT } from "../../config/index";
import { filterUniqueNews, pickFirstNNews } from "../utils/utils";
import {
    // generateChatGPTPromptForLinkedIn,
    generateChatGPTPromptForNewsLetter,
    generateChatGPTPromptForTwitter,
} from "../utils/generateChatGPTPrompt";
import { generateContentWithGPT } from "../utils/generateContentWithGPT";
import { generateImage, generateImagePrompt } from "../utils/generateImage";
import { sendMail } from "../utils/sendMail";
// import { postOnTwitter } from "../utils/postOnSocialMedia";
import { URL } from "url";
import Twitter from "twitter-lite";
import { app } from "../index";

interface NewsPost {
    news: string;
    emails: string[];
    from: string;
    to: string;
    postToTwitter: boolean;
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
        const { news, emails, to, from, oauth_token, oauth_verifier, postToTwitter } = req.body;
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

        await sendMail(emails, imageResponse, gptResponse, uniqueNews, news);
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
            await userClient.post("statuses/update", { status: tweetText });
        }
        return res.status(200).json({
            success: true,
            message: "News Letter sent succesfully ",
        });
    } catch (error) {
        console.log("Error showing", error);
        return res.status(500).json({
            success: false,
            message: "Error on automated news letter",
            error: error,
        });
    }
};

export const callBackTwitter = async (req: Request<{}, {}>, res: Response) => {
    try {
        const oauth_token = req.query.oauth_token as string;
        const oauth_verifier = req.query.oauth_verifier as string;
        const { oauth_token: accessToken, oauth_token_secret: accessSecret } = await twitterClient.getAccessToken({
            oauth_verifier,
            oauth_token,
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
        let oauth_token = "",
            oauth_token_secret;
        const twitterToken = await twitterClient.getRequestToken("http://192.168.0.205:3000/twitter-auth");
        if (twitterToken.oauth_callback_confirmed === "true") {
            oauth_token = twitterToken.oauth_token;
            oauth_token_secret = twitterToken.oauth_token_secret;
        }
        // Save the request token secret to compare later
        // In a real application, you would want to store this securely and associate it with the user
        app.locals.requestTokenSecret = oauth_token_secret;
        const authURL = new URL("https://api.twitter.com/oauth/authenticate");
        authURL.searchParams.append("oauth_token", oauth_token);
        // res.send(`<a href="${authURL.toString()}">Click here to authorize the app</a>`);
        res.status(200).json({ authURL: authURL.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred.");
    }
};
