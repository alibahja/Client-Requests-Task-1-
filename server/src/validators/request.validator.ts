import {z} from "zod";

import { REQUEST_STATUSES } from "../models/Request.model";

export const createRequestSchema=z.object({
    clientName: z
    .string({ message: "Client name is required" })
    .trim()
    .min(2, "Client name must be at least 2 characters")
    .max(100),

  clientEmail: z
    .string({ message: "Client email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid client email"),

  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(120),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),

  status: z.enum(REQUEST_STATUSES).optional(), // defaults to "New" in the model
})

export type CreateRequestInput=z.infer<typeof createRequestSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(REQUEST_STATUSES, {
    message: `Status must be one of: ${REQUEST_STATUSES.join(", ")}`,
  }),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;


export const requestIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid request id"),
});

export type RequestIdParam = z.infer<typeof requestIdParamSchema>;