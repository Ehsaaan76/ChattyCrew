import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();
const app = express();

const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", Credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(port || 5001, () => {
  console.log(`App is listening ${port}`);
  connectDB();
});
