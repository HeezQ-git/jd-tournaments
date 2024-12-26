import supabase from '@/utils/supabase/supabaseClient';
import { notifications } from '@mantine/notifications';
import ROUTES from '@/utils/routes';
import { TbExclamationCircle } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { login, register } from '../../Verification/auth';
import { AuthFormValues } from './authFormContext';

export const useAuthSubmit = ({
  setLoading,
  type,
  t,
  redirectUrl,
  form,
}: {
  setLoading: (_: boolean) => void;
  type: 'login' | 'register';
  t: TransFunction;
  redirectUrl: string;
  form: UseFormReturnType<AuthFormValues>;
}) => {
  const router = useRouter();

  const handleAuthSubmit = useCallback(
    async (data: AuthFormValues) => {
      setLoading(true);

      try {
        const { email, username = '', password, confirmPassword } = data;

        if (type === 'register' && password !== confirmPassword) {
          form.setFieldError('confirmPassword', t('validation.passwordsMatch'));
          return setLoading(false);
        }

        let responseData: any = null;

        if (type === 'register') {
          responseData = await register(email, username, password);
        } else {
          responseData = await login(email, password);
        }

        let error: {
          message: string;
          field: string;
        } | null =
          typeof responseData === 'string' || responseData?.error
            ? { message: responseData?.error || responseData, field: 'email' }
            : null;

        if (error) {
          switch (responseData) {
            case 'user_already_exists':
            case 'User not found':
              error = {
                message: t('validation.emailTaken'),
                field: 'email',
              };
              break;
            case 'unexpected_failure':
              error = {
                message: t('validation.usernameTaken'),
                field: 'username',
              };
              break;
            case 'invalid_credentials':
              error = {
                message: t('validation.invalidCredentials'),
                field: 'password',
              };
              break;
            default:
              break;
          }

          form.setFieldError(error.field, error.message);
        } else {
          if (responseData.session?.access_token) {
            await supabase().auth.setSession({
              access_token: responseData.session.access_token as string,
              refresh_token: responseData.session.refresh_token as string,
            });
          } else {
            setLoading(false);
            return notifications.show({
              title: t('common:error'),
              message: responseData.error?.message || t('errors.unknown'),
              color: 'red',
            });
          }

          const message = {
            title:
              type === 'register'
                ? t('messages.accountCreated')
                : t('messages.loggedIn'),
            message:
              type === 'register'
                ? t('messages.welcome', { username })
                : t('messages.welcomeBack', {
                    username: responseData?.user?.user_metadata?.username,
                  }),
          };

          notifications.show({
            ...message,
            autoClose: 5000,
          });

          if (type === 'register') {
            router.push(ROUTES.GUEST.FINALIZE);
            return setLoading(false);
          }

          router.push(redirectUrl);
        }
      } catch (error: any) {
        notifications.show({
          title: t('common:error'),
          message: t(error?.response?.data?.error || 'common:errors.unknown'),
          color: 'red',
          icon: <TbExclamationCircle />,
        });
      } finally {
        setLoading(false);
      }
    },
    [form, setLoading, router, t, type, redirectUrl],
  );

  return handleAuthSubmit;
};
