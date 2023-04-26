import dotenv from "dotenv";
dotenv.config({
    path: ".env",
});
import { TwitterApi } from "twitter-api-v2";
import { generateTwitterPromptForSummarizing } from "./generateChatGPTPrompt";
import { generateContentWithGPT } from "./generateContentWithGPT";

const client = new TwitterApi({
    appKey: process.env.APP_KEY!,
    appSecret: process.env.APP_KEY_SECRET!,
    accessToken: process.env.ACCESS_TOKEN!,
    accessSecret: process.env.ACCESS_TOKEN_SECRET!,
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
