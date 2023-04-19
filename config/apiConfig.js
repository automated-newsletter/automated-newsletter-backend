const { default: axios } = require("axios");

const newsApiInstance = axios.create({
    baseURL: "https://newsapi.org/v2",
});

const chatGptInstance = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: `Bearer ${process.env.GPT_API_KEY}`,
    },
});

module.exports = { newsApiInstance, chatGptInstance };
