const { chatGptInstance } = require("../config/apiConfig");

const generateContentWithGPT = async (gptPrompt) => {
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

module.exports = { generateContentWithGPT };
