import { chatGptInstance } from "../config/api";

export const generateContentWithGPT = async (gptPrompt: string) => {
    try {
        const response = await chatGptInstance.post(`/chat/completions`, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: gptPrompt }],
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(error);
    }
};
