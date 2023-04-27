import { Request, Response } from "express";
import { getNews } from "../utils/getNews";
import { NEWS_API_KEY } from "../../config/index";
import { filterUniqueNews, pickFirstNNews } from "../utils/utils";
import {
    generateChatGPTPromptForNewsLetter,
    generateChatGPTPromptForTwitter,
} from "../utils/generateChatGPTPrompt";
import { generateContentWithGPT } from "../utils/generateContentWithGPT";
import { generateImage, generateImagePrompt } from "../utils/generateImage";
import { sendMail } from "../utils/sendMail";
import { postOnTwitter } from "../utils/postOnSocialMedia";

interface NewsPost {
    news: string;
    emails: string[];
    from: string;
    to: string;
}

export const newAutomatedLetter = async (req: Request<{}, {}, NewsPost>, res: Response) => {
    try {
        const { news, emails, to, from } = req.body;
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

        // const promptForLinkedIn = generateChatGPTPromptForLinkedIn(gptResponse);
        const promptForTwitter = generateChatGPTPromptForTwitter(gptResponse);

        // const gptResponseLinkedIn = await generateContentWithGPT(promptForLinkedIn);
        const gptResponseTwitter = await generateContentWithGPT(promptForTwitter);

        // console.log("\n\nLinkedIn\n\n", gptResponseLinkedIn.choices[0].message.content);
        console.log("\n\nTwitter\n\n", gptResponseTwitter);

        await sendMail(emails, imageResponse, gptResponse, uniqueNews, news);
        await postOnTwitter(gptResponseTwitter);
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
