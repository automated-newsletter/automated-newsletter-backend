import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { PORT } from "./config";
import { newAutomatedLetter, authorizeTwitter, callBackTwitter, authorizeLinkedin } from "./controller";
import { SocketServer } from "./socket/socket";
import { validateRequest } from "./middleware/validateRequest";
import { newsLetterValidator } from "./validator/newsletter.validator";

const app = express();
const server = http.createServer(app);
export const socketServer = new SocketServer(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Logging requests to console.
app.use(morgan("dev"));

app.use("/api", validateRequest(newsLetterValidator), newAutomatedLetter);
app.get("/callback", callBackTwitter);
app.get("/authorize-linkedin", authorizeLinkedin);
app.get("/authorize", authorizeTwitter);

server.listen(PORT, () => {
    console.log(`🔥 [server]: server is running at http://localhost:${PORT}`);
});
