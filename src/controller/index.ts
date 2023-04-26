import { Request, Response } from "express";
import { getNews } from "../utils/getNews";
import { NEWS_API_KEY } from "../../config/config";
import { filterUniqueNews, pickFirstTenNews } from "../utils/utils";
import {
    // generateChatGPTPromptForLinkedIn,
    generateChatGPTPromptForNewsLetter,
    generateChatGPTPromptForTwitter,
} from "../utils/generateChatGPTPrompt";
import { generateContentWithGPT } from "../utils/generateContentWithGPT";
import { generateImage, generateImagePrompt } from "../utils/generateImage";
import { sendMail } from "../utils/sendMail";
import { postOnTwitter } from "../utils/postOnSocialMedia";

interface NewsPost {
    news: string;
    email: string[];
    from: string;
    to: string;
}

export const newAutomatedLetter = async (req: Request<{}, {}, NewsPost>, res: Response) => {
    try {
        const { news, email, to, from } = req.body;
        const newsData = await getNews(news, from, to, NEWS_API_KEY);
        console.log("news", newsData);
        const uniqueNewsData = filterUniqueNews(newsData.articles, "title");
        console.log("randomUniqueNews", uniqueNewsData);
        const randomUniqueNews = pickFirstTenNews(uniqueNewsData, 5);
        console.log("randomUniqueNews", randomUniqueNews);
        const prompt = generateChatGPTPromptForNewsLetter(randomUniqueNews);
        console.log("prompt", prompt);
        const gptResponse = await generateContentWithGPT(prompt);
        console.log("gptResponse", gptResponse);
        const summary = gptResponse.choices[0].message.content;

        console.log("news", randomUniqueNews);

        const imagePrompt = generateImagePrompt(summary);
        const imagePromptGPT = await generateContentWithGPT(imagePrompt);

        console.log("imagePrompt", imagePromptGPT.choices[0].message.content);

        const imageResponse = await generateImage(imagePromptGPT.choices[0].message.content);

        console.log("Summary\n\n", summary);
        console.log("image", imageResponse.data[0].url, imageResponse);

        // const promptForLinkedIn = generateChatGPTPromptForLinkedIn(summary);
        const promptForTwitter = generateChatGPTPromptForTwitter(summary);

        // const gptResponseLinkedIn = await generateContentWithGPT(promptForLinkedIn);
        const gptResponseTwitter = await generateContentWithGPT(promptForTwitter);

        // console.log("\n\nLinkedIn\n\n", gptResponseLinkedIn.choices[0].message.content);
        console.log("\n\nTwitter\n\n", gptResponseTwitter.choices[0].message.content);

        await sendMail(email, imageResponse.data[0].url, summary, randomUniqueNews, news);
        await postOnTwitter(gptResponseTwitter.choices[0].message.content);
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
