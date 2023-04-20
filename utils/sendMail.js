const sgMail = require("@sendgrid/mail");
const { createTemplateHtml } = require("../utils/template");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const sendMail = async (userMailAddress, imageNewsUrl, summary, randomUniqueNews, news) => {
    try {
        const message = {
            to: userMailAddress,
            from: process.env.EMAIL_SENDER,
            subject: "News Letter",
            text: "Hello from send grid",
            html: createTemplateHtml(imageNewsUrl, summary, randomUniqueNews, news),
        };
        const response = await sgMail.send(message);
        console.log("response", response);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { sendMail };
