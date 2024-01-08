import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config({
  path: "./config/config.env",
});
const app = express();

// using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Specify the exact origin of your frontend application
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
// Importing & use routes
import user from "./routes/userRoutes.js";
import product from './routes/productRoutes.js'


app.use("/api/v1", user);
app.use("/api/v1",product);


export default app;
