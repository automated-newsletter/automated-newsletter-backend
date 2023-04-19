const { chatGptInstance } = require("../config/apiConfig");

const generateImagePrompt = (summary) => {
    const basePrompt = `
    You are a master in creating prompts for generative AI image tool DALL-E.
Read the summary given below and generate a creative and short prompt for generative AI image tool DALL-E, also add the type of image in the prompt for example: "futuristic", "robotic", "sci-fi", "realistic" and so on. Don't include any details about people or person:

    `;

    return basePrompt + summary;
};

const generateImage = async (imagePrompt) => {
    try {
        const imageResponse = await chatGptInstance.post("/images/generations", {
            prompt: imagePrompt,
            n: 1,
            size: "256x256",
        });
        return imageResponse.data;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { generateImage, generateImagePrompt };
