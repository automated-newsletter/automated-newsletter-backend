import readline from "readline";
import {
    generateChatGPTPromptForNewsLetter,
    generateChatGPTPromptForLinkedIn,
    generateChatGPTPromptForTwitter,
} from "./utils/generateChatGPTPrompt";
import { calulateDate, filterUniqueNews, pickFirstTenNews } from "./utils/utils";
import { getNews } from "./utils/getNews";
import { generateContentWithGPT } from "./utils/generateContentWithGPT";
import { generateImage, generateImagePrompt } from "./utils/generateImage";
import dotenv from "dotenv";
import { sendMail } from "./utils/sendMail";
import { postOnTwitter } from "./utils/postOnSocialMedia";
dotenv.config({
    path: ".env",
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Topic you want to search ? ", function (news) {
    rl.question("Number of days you want articles from? ", async function (date) {
        const { formattedDate, formattedTodayDate } = calulateDate(Number(date));
        const newsData = await getNews(news, formattedDate, formattedTodayDate, process.env.NEWS_API_KEY!);
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

        const promptForLinkedIn = generateChatGPTPromptForLinkedIn(summary);
        const promptForTwitter = generateChatGPTPromptForTwitter(summary);

        const gptResponseLinkedIn = await generateContentWithGPT(promptForLinkedIn);
        const gptResponseTwitter = await generateContentWithGPT(promptForTwitter);

        console.log("\n\nLinkedIn\n\n", gptResponseLinkedIn.choices[0].message.content);
        console.log("\n\nTwitter\n\n", gptResponseTwitter.choices[0].message.content);

        await sendMail("shairali@dechains.com", imageResponse.data[0].url, summary, randomUniqueNews, news);
        await postOnTwitter(gptResponseTwitter.choices[0].message.content);
        rl.close();
    });
});

rl.on("close", function () {
    process.exit(0);
});
