import dotenv from "dotenv";
import { generateChatGPTPromptForTwitter, generateTwitterPromptForSummarizing } from "./generateChatGPTPrompt";
import { generateContentWithGPT } from "./generateContentWithGPT";
import { TWITTER_RETRY_LIMIT } from "../../config";
dotenv.config({
    path: ".env",
});

export const generateTwitterSummary = async (summary: string) => {
    try {
        let gptResponseTwitter: string = "";
        let limitCount = 0;
        const promptForTwitter = generateChatGPTPromptForTwitter(summary);
        gptResponseTwitter = await generateContentWithGPT(promptForTwitter);

        while (gptResponseTwitter.length > 250 && limitCount < Number(TWITTER_RETRY_LIMIT)) {
            console.log("limitCount", limitCount);
            limitCount += 1;

            const newPrompt = generateTwitterPromptForSummarizing(gptResponseTwitter);
            gptResponseTwitter = await generateContentWithGPT(newPrompt);
        }

        return gptResponseTwitter;
    } catch (error) {
        console.log("error", error);
    }
};
