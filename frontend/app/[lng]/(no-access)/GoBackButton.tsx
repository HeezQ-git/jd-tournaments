'use client';

import { useTranslation } from '@/i18n/client';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import { TbArrowBack } from 'react-icons/tb';

const GoBackButton = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);
  const router = useRouter();

  return (
    <Button
      fullWidth
      onClick={() => router.back()}
      leftSection={<TbArrowBack size={18} />}
    >
      {t('navigation.goBack')}
    </Button>
  );
};

export default GoBackButton;
