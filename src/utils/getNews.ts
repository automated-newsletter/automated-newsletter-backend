import { newsApiInstance } from "./../../config/api";

export const getNews = async (category: string, fromDate: string, toDate: string, apiKey: string) => {
    try {
        const queryParams = `q=${category}&from=${fromDate}&to=${toDate}&sortBy=relevancy&apiKey=${apiKey}&language=en&excludeDomains=biztoc.com`;

        const newsResponse = await newsApiInstance.get(`/everything?${queryParams}`);

        return newsResponse.data;
    } catch (error) {
        console.error(error);
    }
};
