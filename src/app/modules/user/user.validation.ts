import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().min(11).optional(),
  password: z.string().min(8),
});
