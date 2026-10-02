import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { env } from "./config/env";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

const app: Application = express();

// Security & parsing
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Logging (dev only) 
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check 
app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is live" });
});

// API
app.use("/api/v1", routes);

// 404 + error handling (MUST be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;