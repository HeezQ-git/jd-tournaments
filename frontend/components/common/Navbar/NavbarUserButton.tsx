import React from 'react';
import { Avatar, Flex, Menu, rem, Text, UnstyledButton } from '@mantine/core';
import { UserMetadata } from '@supabase/supabase-js';
import { useMediaQuery } from '@mantine/hooks';
import { TbChevronRight, TbLogout } from 'react-icons/tb';
import { useTranslation } from '@/i18n/client';
import Link from 'next/link';
import ROUTES from '@/utils/routes';
import { useUserStore } from '@/stores/userStore';
import styles from './Navbar.module.css';
import { theme } from '../Providers/MantineWrapper/MantineWrapper';

const NavbarUserButton = ({
  initialMetadata,
  lng,
}: {
  initialMetadata?: UserMetadata | null;
  lng: string;
}) => {
  const { t } = useTranslation(lng);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);
  const { userMetadata: currentMetadata } = useUserStore();

  const userMetadata = currentMetadata || initialMetadata;

  return (
    <Menu
      position={isMobile ? 'top' : 'right'}
      withArrow
      arrowPosition="side"
      disabled={!userMetadata}
    >
      <Menu.Target>
        <UnstyledButton className={styles.user}>
          <Flex align="center" gap="xs">
            <Avatar src={userMetadata?.avatar_url} radius="xl" size="sm" />

            <Text size="sm" fw={500} truncate flex="1">
              {userMetadata?.username || 'User'}
            </Text>

            <TbChevronRight style={{ width: rem(14), height: rem(14) }} />
          </Flex>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown miw={isMobile ? '90%' : '250'}>
        <Menu.Label>{t('header.account')}</Menu.Label>
        <Menu.Item
          color="red"
          leftSection={<TbLogout />}
          component={Link}
          href={ROUTES.GUEST.LOGOUT}
        >
          {t('header.logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarUserButton;
