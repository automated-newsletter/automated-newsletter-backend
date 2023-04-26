import dotenv from "dotenv";
dotenv.config({
    path: ".env",
});
import axios from "axios";

export const newsApiInstance = axios.create({
    baseURL: "https://newsapi.org/v2",
});

export const chatGptInstance = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: `Bearer ${process.env.GPT_API_KEY!}`,
    },
});
