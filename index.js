import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// ROUTES
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import jobsRoutes from "./routes/jobs.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blogs.js";
import reviewRoutes from "./routes/review.js";

const app = express();

const dbUrl = process.env.DB_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Mongo Connection Open!!!");
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
