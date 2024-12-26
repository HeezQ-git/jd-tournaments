'use client';

import NewHeader from '@/components/common/Header/NewHeader';
import Navbar from '@/components/common/Navbar/Navbar';
import { useGlobalStore } from '@/stores/globalStore';
import { AppShell } from '@mantine/core';
import React from 'react';

const LayoutShell = ({
  children,
  lng,
  isVerified,
  metadata,
  permissions,
}: {
  children: React.ReactNode;
  lng: string;
  isVerified: boolean | null;
  metadata?: any;
  permissions: string[] | null;
}) => {
  const { navbarMobileOpened, navbarDesktopOpened } = useGlobalStore();

  return (
    <AppShell
      padding="xs"
      header={{ height: 50 }}
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: {
          mobile: !navbarMobileOpened,
          desktop: !navbarDesktopOpened,
        },
      }}
    >
      <NewHeader
      // lng={lng}
      // initialIsVerified={isVerified}
      // initialMetadata={metadata}
      // initialPermissions={permissions}
      />
      <Navbar
        lng={lng}
        metadata={metadata}
        isVerified={isVerified}
        permissions={permissions}
      />
      <AppShell.Main className="content">{children}</AppShell.Main>
    </AppShell>
  );
};

export default LayoutShell;
