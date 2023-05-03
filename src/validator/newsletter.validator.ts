import Joi from "joi";
import { NewsPost } from "../controller";

export const newsLetterValidator = Joi.object<NewsPost>({
    news: Joi.string().required(),
    emails: Joi.array().items(Joi.string().email()).required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    postToTwitter: Joi.boolean().required(),
    postToLinkedIn: Joi.boolean().required(),
    socketId: Joi.string().required(),
    linkedInAuthCode: Joi.string().optional(),
    oauth_token: Joi.string().optional(),
    oauth_verifier: Joi.string().optional(),
});
