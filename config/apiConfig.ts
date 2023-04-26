import axios from "axios";
import { GPT_API_KEY } from "./config";

export const newsApiInstance = axios.create({
    baseURL: "https://newsapi.org/v2",
});

export const chatGptInstance = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        Authorization: `Bearer ${GPT_API_KEY}`,
    },
});
