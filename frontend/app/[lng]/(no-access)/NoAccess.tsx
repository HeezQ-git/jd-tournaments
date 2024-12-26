import { useTranslation } from '@/i18n';
import { Flex, Paper, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import GoBackButton from './GoBackButton';

const NoAccessPage = async ({ lng }: { lng: string }) => {
  const { t } = await useTranslation(lng);

  return (
    <Flex h="100%" justify="center" align="center">
      <Paper p="lg" h="max-content" shadow="lg" withBorder>
        <Flex align="center" direction="column" gap="sm">
          <Image
            src="/svg/access_denied.svg"
            width={225}
            height={225}
            priority
            alt="No access"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          />
          <Stack align="center" gap="0">
            <Text fz="lg" fw="bold">
              {t('noAccess.title')}
            </Text>
            <Text fz="sm" c="dimmed">
              {t('noAccess.description')}
            </Text>
          </Stack>
          <GoBackButton lng={lng} />
        </Flex>
      </Paper>
    </Flex>
  );
};

export default NoAccessPage;
