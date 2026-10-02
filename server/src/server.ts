import app from "./app";
import { env } from "./config/env";
import { connectToDatabase } from "./config/db";
import mongoose from "mongoose";

async function bootstrap(): Promise<void> {
  try {
    await connectToDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(` Server running on http://localhost:${env.PORT}`);
      console.log(` Environment: ${env.NODE_ENV}`);
    });

    //  Graceful shutdown 
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await mongoose.connection.close();
        console.log(" Server and DB connection closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => void shutdown("SIGINT"));
    process.on("SIGTERM", () => void shutdown("SIGTERM"));

    // Unhandled rejections / exceptions should NOT be silently swallowed
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error(" Uncaught Exception:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

void bootstrap();