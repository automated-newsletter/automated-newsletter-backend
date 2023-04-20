const Twit = require("twit");

const twitterApi = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const postOnTwitter = (twitterSummary) => {
    const tweet = {
        status: twitterSummary,
    };

    try {
        twitterApi.post("statuses/update", tweet, (err, data, response) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Tweet posted successfully", data.text);
            }
        });
    } catch (error) {
        console.log("error", error);
    }
};

module.exports = { postOnTwitter };
