require("dotenv").config({
    path: ".env",
});
const readline = require("readline");
const {
    generateChatGPTPromptForNewsLetter,
    generateChatGPTPromptForSocialMedia,
    generateChatGPTPromptForLinkedIn,
    generateChatGPTPromptForTwitter,
} = require("./utils/generateChatGPTPrompt");
const { getNews } = require("./utils/getNews");
const { calulateDate, filterUniqueNews, pickFirstTenNews } = require("./utils/utils");
const { generateContentWithGPT } = require("./utils/generateContentWithGPT");
const { generateImage, generateImagePrompt } = require("./utils/generateImage");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Topic you want to search ? ", function (news) {
    rl.question("Number of days you want articles from? ", async function (date) {
        const { formattedDate, formattedTodayDate } = calulateDate(date);
        const newsData = await getNews(news, formattedDate, formattedTodayDate, process.env.NEWS_API_KEY);
        const uniqueNewsData = filterUniqueNews(newsData.articles, "title");
        const randomUniqueNews = pickFirstTenNews(uniqueNewsData);
        const prompt = generateChatGPTPromptForNewsLetter(randomUniqueNews);
        const gptResponse = await generateContentWithGPT(prompt);
        const summary = gptResponse.choices[0].message.content;

        const imagePrompt = generateImagePrompt(summary);
        const imagePromptGPT = await generateContentWithGPT(imagePrompt);

        console.log("imagePrompt", imagePromptGPT.choices[0].message.content);

        const imageResponse = await generateImage(imagePromptGPT.choices[0].message.content);

        console.log("Summary\n\n", summary);
        console.log("image", imageResponse.data[0].url);

        const promptForLinkedIn = generateChatGPTPromptForLinkedIn(summary);
        const promptForTwitter = generateChatGPTPromptForTwitter(summary);

        const gptResponseLinkedIn = await generateContentWithGPT(promptForLinkedIn);
        const gptResponseTwitter = await generateContentWithGPT(promptForTwitter);

        console.log("\n\nLinkedIn\n\n", gptResponseLinkedIn.choices[0].message.content);
        console.log("\n\nTwitter\n\n", gptResponseTwitter.choices[0].message.content);

        rl.close();
    });
});

rl.on("close", function () {
    process.exit(0);
});
