require("dotenv").config({
    path: ".env",
});
const readline = require("readline");
const { getNews } = require("./utils/getNews");
const { calulateDate } = require("./utils/utils");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Topic you want to search ? ", function (news) {
    rl.question("Number of days you want articles from? ", async function (date) {
        const { formattedDate, formattedTodayDate } = calulateDate(date);
        const newsData = await getNews(news, formattedDate, formattedTodayDate, process.env.NEWS_API_KEY);

        console.log("news", newsData.articles);
        rl.close();
    });
});

rl.on("close", function () {
    process.exit(0);
});
