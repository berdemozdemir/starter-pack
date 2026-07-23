import { z } from 'zod';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/;

export const signupFormSchema = z
  .object({
    email: z.email('Enter a valid email address'),
    fullName: z
      .string()
      .min(1, 'Enter your full name')
      .max(100, 'Full name must be at most 100 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((password) => strongPasswordRegex.test(password), {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      }),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormSchemaRequest = z.infer<typeof signupFormSchema>;
