import dotenv from "dotenv";
dotenv.config({
    path: ".env",
});
import { TwitterApi } from "twitter-api-v2";
import { generateTwitterPromptForSummarizing } from "./generateChatGPTPrompt";
import { generateContentWithGPT } from "./generateContentWithGPT";
import { ACCESS_TOKEN, ACCESS_TOKEN_SECRET, APP_KEY, APP_KEY_SECRET } from "../../config/config";

const client = new TwitterApi({
    appKey: APP_KEY,
    appSecret: APP_KEY_SECRET,
    accessToken: ACCESS_TOKEN,
    accessSecret: ACCESS_TOKEN_SECRET,
});

const twitterClient = client.readWrite;

export const postOnTwitter = async (twitterSummary: string) => {
    try {
        console.log("twitter len", twitterSummary.length);
        if (twitterSummary.length > 270) {
            const prompt = generateTwitterPromptForSummarizing(twitterSummary);
            const summarizedPost = await generateContentWithGPT(prompt);
            await postOnTwitter(summarizedPost.choices[0].message.content);
            console.log("generating summary again...", prompt);
            return;
        }
        await twitterClient.v1.tweet(twitterSummary);
        console.log("tweet successfully created");
    } catch (e) {
        console.error(e);
    }
};
