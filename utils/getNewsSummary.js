const { chatGptInstance } = require("../config/apiConfig");

const generateNewsSummary = async (gptPrompt) => {
    try {
        const summary = await chatGptInstance.post(`/chat/completions`, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: gptPrompt }],
        });
        return summary.data;
    } catch (error) {
        console.error(error);
    }
};

module.exports = { generateNewsSummary };
