import dotenv from "dotenv";
import { generateTwitterPromptForSummarizing } from "./generateChatGPTPrompt";
import { generateContentWithGPT } from "./generateContentWithGPT";
dotenv.config({
    path: ".env",
});

export const regenerateTwitterSummary = async (summary: string) => {
    try {
        if (summary.length > 250) {
            let gptResponseTwitter: string = "";
            for (let i = 0; i < Number(process.env.TWITTER_RETRY_LIMIT); i++) {
                console.log("generating", i + 1);
                const newPrompt = generateTwitterPromptForSummarizing(summary);
                gptResponseTwitter = await generateContentWithGPT(newPrompt);
                if (gptResponseTwitter.length < 250) break;
            }
            return gptResponseTwitter;
        }
        return summary;
    } catch (error) {
        console.log("error", error);
    }
};
