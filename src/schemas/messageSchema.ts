import { z } from 'zod';

export const messageSchema = z.object({
  email: z.string().email().trim(),
  subject: z.string().min(1).max(200).trim(),
  text: z.string().min(1).max(600).trim(),
});

export type Message = z.infer<typeof messageSchema>;
