import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

interface ErrorResponseBody {
  success: false;
  message: string;
  errors?: unknown[];
  stack?: string;
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: unknown[] = [];

  // 1. Our own ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // 2. Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // 3. Mongoose bad ObjectId
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // 4. Mongoose validation
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // 5. Mongo duplicate key
  else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  ) {
    statusCode = 409;
    const dupErr = err as { keyValue?: Record<string, unknown> };
    const field = dupErr.keyValue ? Object.keys(dupErr.keyValue)[0] : "field";
    message = `Duplicate value for ${field}`;
  }

  // 6. Generic Error
  else if (err instanceof Error) {
    message = err.message;
  }

  const body: ErrorResponseBody = {
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
  };

  // Only leak stack in dev
  if (env.NODE_ENV === "development" && err instanceof Error) {
    body.stack = err.stack;
  }

  if (env.NODE_ENV === "development") {
    console.error(`❌ [${statusCode}] ${message}`, err);
  }

  res.status(statusCode).json(body);
}