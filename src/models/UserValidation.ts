import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(10, "Username must be max 10 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
