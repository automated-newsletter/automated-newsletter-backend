const { default: axios } = require("axios");

const newsApiInstance = axios.create({
    baseURL: "https://newsapi.org/v2",
});

module.exports = { newsApiInstance };
