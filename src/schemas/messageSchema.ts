import { z } from 'zod';

export const messageSchema = z.object({
  email: z.string().email().trim(),
  subject: z.string().min(1).max(200).trim(),
  text: z.string().min(1).max(600).trim(),
});

export const editUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(20).trim().optional(),
  isAdmin: z.boolean().optional(),
  isBanned: z.boolean().optional(),
});

export type Message = z.infer<typeof messageSchema>;
