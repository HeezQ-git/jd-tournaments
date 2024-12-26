import z from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'validation.username.minLength' })
    .max(20, { message: 'validation.username.maxLength' })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: 'validation.username.pattern',
    }),
  email: z.string().email({ message: 'validation.email.pattern' }),
  password: z.any(),
  is_active: z.boolean(),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'validation.username.minLength' })
    .max(20, { message: 'validation.username.maxLength' })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: 'validation.username.pattern',
    }),
  email: z.string().email({ message: 'validation.email.pattern' }),
  password: z
    .string()
    .min(6, { message: 'validation.password.incomplete' })
    .refine((val) => /[!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]/.test(val), {
      message: 'validation.password.incomplete',
    })
    .refine((val) => /[A-Z]/i.test(val), {
      message: 'validation.password.incomplete',
    })
    .refine((val) => /\d/.test(val), {
      message: 'validation.password.incomplete',
    }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'validation.terms.required',
  }),
});

export const loginSchema = z.object({
  email: z.string().min(3, { message: 'validation.required' }),
  password: z.string().min(3, { message: 'validation.required' }),
});
