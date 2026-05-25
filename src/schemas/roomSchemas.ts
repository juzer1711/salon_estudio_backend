import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre es muy corto.")
    .max(60, "El nombre es demasiado largo."),
});

export type CreateRoomDTO =
  z.infer<typeof createRoomSchema>;