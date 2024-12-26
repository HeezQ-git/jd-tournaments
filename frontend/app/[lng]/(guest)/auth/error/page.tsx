'use client';

import { useTranslation } from '@/i18n/client';
import ROUTES from '@/utils/routes';
import { Box, Button, Code, Flex, Paper, rem, Text } from '@mantine/core';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { TbArrowBack } from 'react-icons/tb';

function AuthError({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'auth');

  const [data, setData] = useState({
    error: 'loading...',
    code: '000',
    description: 'loading...',
  });

  useEffect(() => {
    const hash = (window.location.hash as string).replace('#', '?');
    const parsedHash = new URLSearchParams(hash);

    setData({
      error: parsedHash.get('error') || t('error.unknown'),
      code: parsedHash.get('error_code') || '500',
      description: parsedHash.get('error_description') || t('error.unexpected'),
    });
  }, []);

  return (
    <Flex h="100%" justify="center" align="center" mx="xs">
      <Paper p="lg" withBorder maw={600}>
        <Text fz={rem(28)} c="red" fw="bolder">
          {t('error.whoops')}
        </Text>
        <Text fz="lg" fw="bold">
          {t('error.unexpected')}
        </Text>
        <Text>{t('error.contactSupport')}</Text>
        <Box mt="lg">
          <Text c="dimmed" fz="sm" span>
            <Text fw="500" inherit>
              {t('error.details')}
            </Text>
            <Text inherit>
              {t('common:error')}:{' '}
              <Code>
                {data.error || 'unknown'} ({data.code || 500})
              </Code>
            </Text>{' '}
            <Text inherit>
              {t('common:description')}:{' '}
              <Code>{data.description || t('error.unexpected')}</Code>
            </Text>
          </Text>
        </Box>
        <Flex justify="flex-end" mt="lg">
          <Link href={ROUTES.GUEST.AUTH}>
            <Button variant="light" leftSection={<TbArrowBack />}>
              {t('common:navigation.goBack')}
            </Button>
          </Link>
        </Flex>
      </Paper>
    </Flex>
  );
}

export default AuthError;
