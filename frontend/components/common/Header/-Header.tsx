'use client';

import React, { useMemo } from 'react';
import { Flex, Text, Burger, Group, rem } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import ROUTES from '@/utils/routes';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { UserMetadata } from '@supabase/supabase-js';
import { useUserStore } from '@/stores/userStore';
import styles from './Header.module.css';
import NavigationDrawer from './NavigationDrawer/NavigationDrawer';
import UserMenu from './UserMenu';

interface HeaderProps {
  lng: string;
  initialMetadata?: UserMetadata;
  initialIsVerified?: boolean | null;
}

function Header({ lng, initialMetadata, initialIsVerified }: HeaderProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { userMetadata: currentMetadata, isVerified: currentIsVerified } =
    useUserStore();

  const userMetadata = currentMetadata || initialMetadata;
  const isVerified = currentIsVerified || initialIsVerified;

  const [scroll] = useWindowScroll();

  const Logo = useMemo(
    () => (
      <Link href={ROUTES.ADMIN.HOME}>
        <Flex align="center" gap="xs">
          <Image
            src="/images/logo.png"
            width={32}
            height={32}
            alt="logo"
            priority
          />
          <Text fw="normal" h="max-content" lh="xs" fz={rem(20)} span>
            JDT
          </Text>
        </Flex>
      </Link>
    ),
    [],
  );

  const UserMenuElement = useMemo(
    () => <UserMenu userMetadata={userMetadata} lng={lng} />,
    [userMetadata, lng],
  );

  const NavigationDrawerElement = useMemo(
    () => (
      <NavigationDrawer
        opened={drawerOpened}
        closeDrawer={closeDrawer}
        userMetadata={userMetadata}
        isVerified={isVerified}
        lng={lng}
      />
    ),
    [drawerOpened, closeDrawer, userMetadata, isVerified, lng],
  );

  return (
    <>
      <header
        className={clsx(styles.header, scroll.y > 0 && styles.headerGlass)}
      >
        <Flex gap="sm" align="center">
          {Logo}
        </Flex>
        <Group gap="sm">
          {UserMenuElement}
          <Burger size="sm" onClick={toggleDrawer} opened={drawerOpened} />
        </Group>
      </header>
      {NavigationDrawerElement}
    </>
  );
}

export default Header;
