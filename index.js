import express from "express";
import { initApp } from "./src/index.router.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

const app = express();
const port = process.env.DEV_PORT || 3000;

initApp(app, express);

app.listen(port, () => console.log(`App is listening on port ${port}!`));
