import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import postRoutes from "./routes/post_routes";
import authRoutes from "./routes/auth_routes";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routes);
app.use("/post", postRoutes);
app.use("/api/auth", authRoutes);

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taxwise";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err: Error) => {
    console.error(err);
  });

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});