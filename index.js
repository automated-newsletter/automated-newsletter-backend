require("dotenv").config({
    path: ".env",
});
const readline = require("readline");
const { getNews } = require("./utils/getNews");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Topic you want to search ? ", function (news) {
    rl.question("Article you want to date: ? ", async function (date) {
        const newsData = await getNews(news, date, process.env.NEWS_API_KEY);

        console.log("newsData", newsData.articles);

        rl.close();
    });
});

rl.on("close", function () {
    process.exit(0);
});
