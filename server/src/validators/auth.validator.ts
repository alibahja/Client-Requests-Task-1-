import {email, z} from "zod";


export const registerSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z
    .string({ message: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"), // bcrypt caps at 72 bytes
});

export type RegisterInput=z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;