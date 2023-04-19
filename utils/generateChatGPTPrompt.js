const generateChatGPTPromptForNewsLetter = (newsArray) => {
    const basePrompt = `
    Below are the short description of some of the articles. I want you to create a combined summary of all of them. Follow the instruction given below to generate summary:

    1) Note that some of the descriptions are incomplete and ends with "..." You can safely ignore the sentences that are incomplete. 
    2) Use simple words and make it sound interesting. 
    3) Don't use any kind extra information that are not relevant to the summary for example: "As an AI language model...", "Certainly!, Here is a short summary.." and so on. 
    4) Don't use headings in the response for example: "Summary:". 
    5) Make it in one paragraph and keep it as short as possible. Don't create seperate paragraphs for each description.
    6) Don't let the readers know that it's a combined summary.

    SHORT DESCRIPTIONS OF ARTICLES:
    `;

    let descriptions = "";

    for (let i = 0; i < newsArray.length; i++) {
        const news = newsArray[i];

        descriptions += `(${i + 1}) ${news.description}`;
    }

    const completePrompt = basePrompt + descriptions;

    return completePrompt;
};

const generateBasePromptForSocialMedia = (platform) => {
    return `
        You are a master in creating posts for ${platform}.
        Below is the combined summary of multiple articles.
        I want you to create ${platform} post for sharing it on ${platform}.

        Follow the instruction given below to create a post:

        - At the end of each post, but before hashtags Write something to tell the user to checkout our newsletter for complete details.
        - Don't create bullet points. Only create a single paragraph.
        
    `;
};

const generateChatGPTPromptForLinkedIn = (summary) => {
    const basePrompt =
        generateBasePromptForSocialMedia("LinkedIn") +
        ` 
    - It should have a minimum of 1500 characters
    SUMMARY: 
    
    `;

    const completePrompt = basePrompt + summary;

    return completePrompt;
};

const generateChatGPTPromptForTwitter = (summary) => {
    const basePrompt =
        generateBasePromptForSocialMedia("Twitter") +
        `
    
    - It should have a minimum of 700 characters

    SUMMARY:

    `;

    const completePrompt = basePrompt + summary;

    return completePrompt;
};

module.exports = {
    generateChatGPTPromptForNewsLetter,
    generateChatGPTPromptForLinkedIn,
    generateChatGPTPromptForTwitter,
};
