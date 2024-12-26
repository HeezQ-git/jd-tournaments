'use client';

import Loading from '@/components/common/Loading/Loading';
import { useTranslation } from '@/i18n/client';
import ROUTES from '@/utils/routes';
import { Flex } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng);
  const router = useRouter();

  useEffect(() => {
    router.push(ROUTES.ADMIN.HOME);
  }, [router]);

  return (
    <Flex h="100%" align="center" justify="center">
      <Loading text={t('redirecting')} />
    </Flex>
  );
}
