import { useTranslation } from '@/i18n/client';
import { cookieName } from '@/i18n/settings';
import ROUTES from '@/utils/routes';
import { ActionIcon, Button, Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import React from 'react';
import { useCookies } from 'react-cookie';
import { FaDiscord } from 'react-icons/fa';
import { TbX } from 'react-icons/tb';
import { theme } from '../Providers/MantineWrapper/MantineWrapper';

function VerificationBanner({ closeBanner }: { closeBanner: () => void }) {
  const [{ [cookieName]: lng }] = useCookies([cookieName]);
  const { t } = useTranslation(lng, 'auth');

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);

  return (
    <Flex
      px={isMobile ? 'sm' : 'lg'}
      py="xs"
      bg="#5865F299"
      justify="space-between"
      h="50px"
    >
      <Flex
        align={isMobile ? 'start' : 'center'}
        gap="sm"
        direction={isMobile ? 'column' : 'row'}
      >
        {!isMobile && <FaDiscord color="white" />}
        <Text c="white" fz="sm">
          {t('verify.banner.title')}
        </Text>
        <Link href={ROUTES.USER.VERIFY}>
          <Button size="xs" color="#5865F2" rightSection={<TbX />}>
            {t('verify.banner.button')}
          </Button>
        </Link>
      </Flex>
      <Flex align="center" justify="center">
        <ActionIcon variant="subtle" color="white">
          <TbX onClick={closeBanner} />
        </ActionIcon>
      </Flex>
    </Flex>
  );
}

export default VerificationBanner;
