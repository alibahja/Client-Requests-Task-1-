import { Request,Response,NextFunction } from "express";
import { ZodTypeAny,z } from "zod";
import { ApiError } from "../utils/ApiError";

type Source="body" | "query" | "params";

export function validate(schema: ZodTypeAny, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return next(new ApiError(400, "Validation failed", errors));
    }

    // Overwrite with parsed (coerced + sanitized) values
    if (source === "body") req.body = result.data;
    else if (source === "query") req.query = result.data as typeof req.query;
    else req.params = result.data as typeof req.params;

    next();
  };
}
