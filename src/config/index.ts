import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const NEWS_API_KEY = process.env.NEWS_API_KEY!;
export const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY!;
export const TWITTER_APP_KEY = process.env.TWITTER_APP_KEY!;
export const TWITTER_APP_KEY_SECRET = process.env.TWITTER_APP_KEY_SECRET!;
export const GPT_API_KEY = process.env.GPT_API_KEY!;
export const EMAIL_SENDER = process.env.EMAIL_SENDER!;
export const TWITTER_RETRY_LIMIT = process.env.TWITTER_RETRY_LIMIT!;
export const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
export const LINKEDIN_CLIENT_SECRET_ID = process.env.LINKEDIN_CLIENT_SECRET_ID!;
export const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN!;
