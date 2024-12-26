import React, { useMemo } from 'react';
import { Flex, Text, Burger, rem, AppShell, Tooltip } from '@mantine/core';
import ROUTES from '@/utils/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useGlobalStore } from '@/stores/globalStore';
import styles from './Header.module.css';
import ToggleThemeButton from './ToggleThemeButton';

const NewHeader = () => {
  const {
    navbarMobileOpened,
    setNavbarMobileOpened,
    navbarDesktopOpened,
    setNavbarDesktopOpened,
  } = useGlobalStore();

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
          <Flex direction="column" gap="0">
            <Text span h="max-content" c="dimmed" fw="bolder" lh="1.2">
              <Text fz={rem(11)} fw={600} lh="inherit">
                JUST DANCE
              </Text>
              <Text fz={rem(14)} fw="inherit" lh="inherit">
                TOURNAMENTS
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Link>
    ),
    [],
  );

  // const UserMenuElement = useMemo(
  //   () => <UserMenu userMetadata={userMetadata} lng={lng} />,
  //   [userMetadata, lng],
  // );

  return (
    <AppShell.Header
      // className={clsx(styles.header, scroll.y > 0 && styles.headerGlass)}
      className={styles.header}
    >
      <Flex align="center" gap="md">
        <Burger
          opened={navbarMobileOpened}
          onClick={() => setNavbarMobileOpened(!navbarMobileOpened)}
          hiddenFrom="sm"
          size="sm"
        />
        <Burger
          opened={navbarDesktopOpened}
          onClick={() => setNavbarDesktopOpened(!navbarDesktopOpened)}
          visibleFrom="sm"
          size="sm"
        />
        <Flex gap="sm" align="center">
          {Logo}
        </Flex>
      </Flex>
      <ToggleThemeButton />
    </AppShell.Header>
  );
};

export default NewHeader;
