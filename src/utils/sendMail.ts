import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { createTemplateHtml } from "../utils/template";
import dotenv from "dotenv";
dotenv.config({
    path: ".env",
});

sgMail.setApiKey(process.env.SEND_GRID_API_KEY!);
export const sendMail = async (
    userMailAddress: string,
    imageNewsUrl: string,
    summary: string,
    randomUniqueNews: any[],
    news: string
) => {
    try {
        const message: MailDataRequired = {
            to: userMailAddress,
            from: process.env.EMAIL_SENDER!,
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
