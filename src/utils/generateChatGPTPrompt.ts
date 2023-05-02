export const generateChatGPTPromptForNewsLetter = (newsArray: any) => {
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

export const generateBasePromptForSocialMedia = (platform: string) => {
    return `
        You are a master in creating short posts for ${platform} by summarizing the content provided to you.
        Below is the combined summary of multiple articles.
        I want you to create ${platform} post for sharing it on ${platform}.

        Follow the instruction given below to create a post:

        - At the end of each post, but before hashtags Write something to tell the user to checkout our newsletter for complete details.
        - Don't create bullet points. Only create a single paragraph.
        
    `;
};

export const generateChatGPTPromptForLinkedIn = (summary: string) => {
    const basePrompt =
        generateBasePromptForSocialMedia("LinkedIn") +
        ` 
    - It should have a minimum of 1500 characters
    SUMMARY: 
    
    `;

    const completePrompt = basePrompt + summary;

    return completePrompt;
};

export const generateChatGPTPromptForTwitter = (summary: string) => {
    const basePrompt =
        `You have a detailed summary that's over 2500 characters, but you want to share the essence of it on Twitter. 
        Create a tweet that's no longer than 250 characters and includes relevant hashtags and a call to action. 
        Your tweet should entice readers to subscribe to your newsletter for more information. Remember to keep it concise and compelling!` +
        `
        Here's a detailed summary for you:

        
        `;

    const completePrompt = basePrompt + summary;

    return completePrompt;
};

export const generateTwitterPromptForSummarizing = (twitterSummary: string) => {
    const basePrompt = `
        A twitter post is given below, I want you to summarize it into less than 180 characters. Make sure to keep the tone as if it was a twitter post.
        Also make sure to follow the below instructions too:

        - At the end of each post, but before hashtags Write something to tell the user to checkout our newsletter for complete details.
        - Don't create bullet points. Only create a single paragraph.
    `;

    return basePrompt + twitterSummary;
};
