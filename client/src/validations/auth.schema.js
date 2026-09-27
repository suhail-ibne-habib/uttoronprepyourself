import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, { error: "Name must be at least 2 characters" }),
    email: z.email("Enter a valid email"),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { error: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });
