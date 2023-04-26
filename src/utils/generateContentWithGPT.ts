import { chatGptInstance } from "./../../config/apiConfig";

export const generateContentWithGPT = async (gptPrompt: string) => {
    try {
        const response = await chatGptInstance.post(`/chat/completions`, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: gptPrompt }],
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
