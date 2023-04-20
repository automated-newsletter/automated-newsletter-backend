const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_KEY_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const twitterClient = client.readWrite;

const postOnTwitter = async (twitterSummary) => {
    try {
        await twitterClient.v1.tweet(twitterSummary);
        console.log("tweet successfully created");
    } catch (e) {
        console.error(e);
    }
};

module.exports = { postOnTwitter };
