import { useTranslation } from '@/i18n/client';
import { Flex, Paper, Stack, Text } from '@mantine/core';
import { AxiosError } from 'axios';
import { some } from 'lodash';
import React from 'react';
import { TbLock } from 'react-icons/tb';

const NoPermissionWrapper = ({
  errors,
  children,
  lng,
}: {
  errors?: (AxiosError | null)[];
  children: React.ReactNode;
  lng: string;
}) => {
  const { t } = useTranslation(lng);

  const isPermissionError = some(
    errors,
    (error) => error?.response?.status === 403,
  );

  if (isPermissionError) {
    return (
      <Flex
        w="100%"
        h="100%"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        <Paper
          p="md"
          radius="md"
          withBorder
          shadow="md"
          bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))"
        >
          <Flex direction="column" align="center" justify="center" gap="xs">
            <TbLock size={46} color="var(--mantine-color-teal-6)" />
            <Stack gap="0" align="center">
              <Text fw="bold">{t('errors.permission.title')}</Text>
              <Text
                c="dimmed"
                fz="sm"
                style={{ whiteSpace: 'break-spaces' }}
                ta="center"
                lh="xs"
              >
                {t('errors.permission.description')}
              </Text>
            </Stack>
          </Flex>
        </Paper>
      </Flex>
    );
  }

  return children;
};

export default NoPermissionWrapper;
