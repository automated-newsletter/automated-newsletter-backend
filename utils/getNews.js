const { newsApiInstance } = require("../config/apiConfig");

const getNews = async (category, fromDate, toDate, apiKey) => {
    try {
        const queryParams = `q=${category}&from=${fromDate}&to=${toDate}&sortBy=relevancy&apiKey=${apiKey}&language=en&excludeDomains=biztoc.com`;

        const newsResponse = await newsApiInstance.get(`/everything?${queryParams}`);

        return newsResponse.data;
    } catch (error) {
        console.error(error);
    }
};

module.exports = { getNews };
