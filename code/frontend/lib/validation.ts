import { z } from 'zod';

export const loginSchema = z.object({
    nickName: z.string().min(3, 'Nickname is required and must be at least 3 characters'),
    fullName: z.string().min(3, 'Full name is required and must be at least 3 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
