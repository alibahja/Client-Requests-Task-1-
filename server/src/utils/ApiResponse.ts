import { Response } from "express";

interface ApiResponsePayload<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;

  constructor(statusCode: number, data: T | null, message = "Success") {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

/**
 * Helper to send a consistent JSON response.
 * Use inside controllers: sendResponse(res, 200, data, "Fetched");
 */
export function sendResponse<T>(
  res: Response,
  statusCode: number,
  data: T | null,
  message = "Success"
): Response {
  const payload: ApiResponsePayload<T> = {
    success: statusCode < 400,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
}