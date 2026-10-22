import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "At least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name:     z.string().min(1, "Name is required").min(2, "At least 2 characters").max(80),
  email:    z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(6, "At least 6 characters").max(100),
});
export type SignupInput = z.infer<typeof signupSchema>;
