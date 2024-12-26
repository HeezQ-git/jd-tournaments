/* eslint-disable react-hooks/rules-of-hooks */

import Loading from '@/components/common/Loading/Loading';
import { useTranslation } from '@/i18n';
import { setPageTitle } from '@/utils/setPageTitle';
import { Flex } from '@mantine/core';
import React from 'react';
import { LogoutHandler } from './useLogout';

export async function generateMetadata() {
  return setPageTitle('auth.logout');
}

const LogoutPage = async ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = await useTranslation(lng, 'auth');

  return (
    <Flex h="100%" align="center" justify="center">
      <Loading text={t('loggingOut')} />
      <LogoutHandler />
    </Flex>
  );
};

export default LogoutPage;
