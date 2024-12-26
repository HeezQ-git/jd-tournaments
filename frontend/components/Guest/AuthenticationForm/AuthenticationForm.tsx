'use client';

import { useToggle, upperFirst, useFocusWithin } from '@mantine/hooks';
import {
  Text,
  Paper,
  Group,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Flex,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from 'mantine-form-zod-resolver';
import { loginSchema, registerSchema } from '@/validations/user';
import { useTranslation } from '@/i18n/client';
import ROUTES from '@/utils/routes';
import supabase from '@/utils/supabase/supabaseClient';
import { AuthFormProvider, useAuthForm } from './lib/authFormContext';
import { useAuthSubmit } from './lib/actionsHandler';
import {
  ConfirmPasswordInput,
  EmailInput,
  ProvidersButtons,
  ProvidersInfoTooltip,
  PwdStrengthValidation,
  UsernameInput,
} from './components';
import PasswordInputElement from './components/PasswordInput';

export interface PasswordStrengthValues {
  minimum: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

const AuthenticationForm = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng, 'auth');

  const { ref, focused } = useFocusWithin();

  const [passwordStrengthValues, setPasswordStrengthValues] =
    useState<PasswordStrengthValues>({
      minimum: false,
      uppercase: false,
      number: false,
      special: false,
    });
  const [loading, setLoading] = useState(false);
  const [type, toggle] = useToggle<'login' | 'register'>(['login', 'register']);
  const isTypeLogin = type === 'login';

  const params = useSearchParams();

  const redirectUrl = params.get('redirect') || ROUTES.HOME;

  const form = useAuthForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    clearInputErrorOnChange: false,
    onValuesChange: (values) => {
      if (values.password !== values.confirmPassword) {
        form.setFieldError('confirmPassword', 'validation.passwordsMatch');
      } else {
        form.clearFieldError('confirmPassword');
      }
    },
    validate: zodResolver(!isTypeLogin ? registerSchema : loginSchema),
  });

  const onSubmit = useAuthSubmit({ setLoading, type, t, redirectUrl, form });

  useEffect(() => {
    if (params.get('type')) toggle((params.get('type') as any) || 'login');
    if (params.get('action') === 'logout') {
      const handleSignout = async () => {
        await supabase().auth.signOut();
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('action');
        window.location.href = newUrl.toString();
      };

      handleSignout();
    }
  }, [params]);

  return (
    <AuthFormProvider form={form}>
      <Flex align="center" maw="400" h="100%" mx="auto" px="sm" mt="xl">
        <Paper h="max-content" radius="md" p="xl" withBorder>
          <Group gap="xs" align="center">
            <Text size="md" fw={500}>
              {t('welcome')}
            </Text>
            <ProvidersInfoTooltip shouldShow={isTypeLogin} t={t} />
          </Group>

          <ProvidersButtons t={t} shouldShow={isTypeLogin} />

          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack>
              <UsernameInput t={t} shouldShow={!isTypeLogin} />
              <EmailInput t={t} isTypeLogin={isTypeLogin} />

              <PasswordInputElement
                t={t}
                type={type}
                setPasswordStrengthValues={setPasswordStrengthValues}
                ref={ref}
              />

              {!isTypeLogin && (
                <>
                  <PwdStrengthValidation
                    t={t}
                    focused={focused}
                    values={passwordStrengthValues}
                  />

                  <ConfirmPasswordInput
                    t={t}
                    shouldShow={!!form.values.password && !isTypeLogin}
                  />
                  <Checkbox
                    label={t('form.terms')}
                    checked={form.values.terms}
                    onChange={(event) =>
                      form.setFieldValue('terms', event.currentTarget.checked)
                    }
                    error={t(`${form.errors.terms ?? ''}`)}
                  />
                </>
              )}
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {!isTypeLogin ? t('form.haveAccount') : t('form.noAccount')}{' '}
                <Text
                  variant="gradient"
                  inline
                  gradient={{
                    from: 'teal',
                    to: 'cyan',
                  }}
                  style={{
                    backgroundRepeat: 'no-repeat',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  fw="bold"
                  fz="xs"
                  component="span"
                >
                  {upperFirst(!isTypeLogin ? t('login') : t('register'))}
                </Text>
              </Anchor>
              <Button type="submit" radius="xl" loading={loading}>
                {upperFirst(t(type))}
              </Button>
            </Group>
          </form>
        </Paper>
      </Flex>
    </AuthFormProvider>
  );
};

export default AuthenticationForm;
