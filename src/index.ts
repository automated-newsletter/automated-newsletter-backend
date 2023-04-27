import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { PORT } from "../config";
import { newAutomatedLetter, authorizeTwitter, callBackTwitter } from "./controller";

export const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Logging requests to console.
app.use(morgan("dev"));

app.use("/api", newAutomatedLetter);
app.get("/callback", callBackTwitter);
app.get("/authorize", authorizeTwitter);

server.listen(PORT, () => {
    console.log(`🔥 [server]: server is running at http://localhost:${PORT}`);
});
