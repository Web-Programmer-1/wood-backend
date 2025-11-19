import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
  role: z.enum(["CUSTOMER", "ADMIN", "VENDOR"]).optional(),
  provider: z.enum(["LOCAL", "GOOGLE", "FACEBOOK"]).optional(),
  providerId: z.string().optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
