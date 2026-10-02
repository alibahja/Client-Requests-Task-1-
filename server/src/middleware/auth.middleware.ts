import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User.model";

/**
 * Requires a valid Bearer token. Attaches req.user.
 */
export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authenticated");
    }

    const token = header.split(" ")[1];
    if (!token) throw new ApiError(401, "Malformed authorization header");

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(payload._id).select("_id name email");
    if (!user) throw new ApiError(401, "User no longer exists");

    req.user = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    next();
  }
);

/**
 * Role-based guard. Only use if you add a `role` field to User.
 * Kept here so you know where it goes.
 */
export function restrictTo(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const role = (req.user as { role?: string } | undefined)?.role;
    if (!role || !roles.includes(role)) {
      return next(new ApiError(403, "You do not have permission"));
    }
    next();
  };
}