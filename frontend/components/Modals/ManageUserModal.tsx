'use client';

import React from 'react';
import {
  ActionIcon,
  ActionIconGroup,
  Button,
  Checkbox,
  CopyButton,
  Flex,
  Group,
  PasswordInput,
  rem,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  FaExclamationTriangle,
  FaQuestionCircle,
  FaRandom,
} from 'react-icons/fa';
import { useForm, zodResolver } from '@mantine/form';
import { generatePassword } from '@/utils/utils';
import { createUserSchema } from '@/validations/user';
import { useCreateUser } from '@/api/user/useCreateUser';
import type { ContextModalProps } from '@mantine/modals/lib/context';
import { User } from '@/types/user';
import { useEditUser } from '@/api/user/useEditUser';
import { notifications } from '@mantine/notifications';
import { useCookies } from 'react-cookie';
import { cookieName } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { Trans } from 'react-i18next';
import { useUserData } from '@/hooks/useUserData';
import { TbCheck, TbCopy, TbUserPlus } from 'react-icons/tb';
import { theme } from '../common/Providers/MantineWrapper/MantineWrapper';

function CreateUserModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{ action: 'create' | 'edit'; userData?: User }>) {
  const [cookies] = useCookies([cookieName]);
  const lng = cookies[cookieName];
  const { t } = useTranslation(lng, 'users');

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);
  const { mutate: createUser, isPending: creatingUser } = useCreateUser(t);
  const { mutate: editUser, isPending: editingUser } = useEditUser(t);
  const { action, userData } = innerProps || {};

  const isPending = creatingUser || editingUser;

  const form = useForm({
    initialValues: {
      username: userData?.username || generatePassword(8),
      email: userData?.email || `${generatePassword(8)}@example.com`,
      password: generatePassword(8),
      is_active: userData?.is_active || true,
      discord_id: userData?.discord_id || '',
      generate_password: false,
    },
    validateInputOnChange: true,
    validate: zodResolver(createUserSchema),
  });

  const data = useUserData(['discord_id'], userData?.id);
  const discordId = data?.discord_id || form.values.discord_id;

  const handleSubmit = (values: typeof form.values) => {
    if (action === 'create') {
      return createUser(values, {
        onSuccess: () => {
          form.reset();
          context.closeModal(id);
        },
      });
    }

    if (!userData) {
      return notifications.show({
        message: t('modal.errors.userDataMissing'),
        color: 'red',
      });
    }

    const changedValues = Object.entries(values).reduce(
      (acc: any, [key, value]) => {
        if (key === 'password') return acc;

        if (value !== (userData as User)?.[key as keyof User]) {
          acc[key] = value;
        }
        return acc;
      },
      {} as typeof values,
    );

    if (Object.keys(changedValues).length === 0) {
      return notifications.show({
        message: t('modal.errors.noChanges'),
        color: 'red',
      });
    }

    return editUser(
      { id: userData.id, ...changedValues },
      { onSuccess: () => context.closeModal(id) },
    );
  };

  // useEffect(() => {
  //   if (!userData) return;

  //   (async () => {
  //     const { data } = await supabase()
  //       .from('users')
  //       .select('discord_id')
  //       .eq('id', userData?.id)
  //       .single();

  //     setDiscordId(data?.discord_id);
  //   })();
  // }, []);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction="column" gap="md">
        <Group w="100%" wrap={isMobile ? 'wrap' : 'nowrap'}>
          <TextInput
            label={t('modal.labels.username')}
            aria-label="Username"
            aria-required
            autoComplete="name"
            required
            w="100%"
            {...form.getInputProps('username')}
          />
          <TextInput
            label={t('modal.labels.email')}
            required
            autoComplete="email"
            w="100%"
            {...form.getInputProps('email')}
          />
        </Group>
        <TextInput
          label={
            <Flex align="center" gap="xs">
              <Text inherit>{t('modal.labels.discordID')}</Text>
              <Tooltip
                label={t('modal.tooltips.discordID')}
                w="300"
                multiline
                withArrow
              >
                <ActionIcon variant="transparent" c="dimmed">
                  <FaQuestionCircle />
                </ActionIcon>
              </Tooltip>
            </Flex>
          }
          w="100%"
          disabled={!!userData?.discord_id}
          {...form.getInputProps('discord_id')}
        />

        {action === 'edit' && (
          <Checkbox
            label={t('modal.labels.generatePassword')}
            {...form.getInputProps('generate_password', { type: 'checkbox' })}
            disabled={!discordId}
          />
        )}
        {action === 'create' && (
          <>
            <Flex w="100%" align="flex-end" justify="center" gap="md">
              <Tooltip
                label={t('modal.tooltips.noPreview')}
                disabled={action === 'create'}
                withArrow
              >
                <PasswordInput
                  required
                  w="100%"
                  label="Password"
                  aria-label="Password"
                  aria-required
                  {...form.getInputProps('password')}
                />
              </Tooltip>
              <ActionIconGroup>
                <Tooltip label={t('modal.tooltips.generatePassword')} withArrow>
                  <ActionIcon
                    variant="light"
                    color="blue"
                    size="lg"
                    onClick={() =>
                      form.setFieldValue('password', generatePassword(16))
                    }
                  >
                    <FaRandom />
                  </ActionIcon>
                </Tooltip>
                <CopyButton value={form.values.password}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={
                        copied
                          ? t('modal.tooltips.copied')
                          : t('modal.tooltips.copy')
                      }
                      withArrow
                      position="top"
                    >
                      <ActionIcon
                        color={copied ? 'teal' : 'gray'}
                        variant="light"
                        size="lg"
                        onClick={copy}
                      >
                        {copied ? (
                          <TbCheck strokeWidth={3} style={{ width: rem(16) }} />
                        ) : (
                          <TbCopy style={{ width: rem(16) }} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </ActionIconGroup>
            </Flex>
            <Checkbox
              label={t('modal.labels.isActive')}
              {...form.getInputProps('is_active', { type: 'checkbox' })}
            />
          </>
        )}
        {discordId ? (
          action === 'edit' && (
            <Text c="dimmed" fz="xs">
              <Trans
                t={t}
                i18nKey="modal.warnings.sendViaDiscord"
                components={{ 1: <Text span fw={600} inherit /> }}
              />
            </Text>
          )
        ) : (
          <Text c="dimmed" fz="xs" span>
            <FaExclamationTriangle />
            <Text inherit span ml="xs">
              {t('modal.warnings.notVerified')}
            </Text>
          </Text>
        )}
        <Button
          type="submit"
          leftSection={
            action === 'create' ? <TbUserPlus /> : <TbCheck strokeWidth={3} />
          }
          loading={isPending}
        >
          {action === 'create'
            ? t('common:buttons.create')
            : t('common:buttons.save')}
        </Button>
      </Flex>
    </form>
  );
}

export default CreateUserModal;
