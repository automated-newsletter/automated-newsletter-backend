const { newsApiInstance } = require("../config/apiConfig");

const getNews = async (category, fromDate, apiKey) => {
    const queryParams = `q=${category}&from=${fromDate}&sortBy=publishedAt&apiKey=${apiKey}&language=en&pageSize=10&excludeDomains=biztoc.com`;

    const newsResponse = await newsApiInstance.get(`/everything?${queryParams}`);

    return newsResponse.data;
};

module.exports = { getNews };
