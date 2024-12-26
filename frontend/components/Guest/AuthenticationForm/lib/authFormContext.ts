import { Song } from '@/types/song';
import { createFormContext, Form } from '@mantine/form';

export type AuthFormValues = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export const [AuthFormProvider, useAuthFormContext, useAuthForm] =
  createFormContext<AuthFormValues>();
