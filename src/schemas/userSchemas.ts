import { z } from "zod";

export const createProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username inválido"
    ),

  firstName: z
    .string()
    .trim()
    .min(2)
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(50),

  avatarUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("")),
});

export type CreateProfileDTO =
  z.infer<typeof createProfileSchema>;