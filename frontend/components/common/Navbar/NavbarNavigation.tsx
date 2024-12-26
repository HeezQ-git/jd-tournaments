'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { UserMetadata } from '@supabase/supabase-js';
import { useTranslation } from '@/i18n/client';

import { languages } from '@/i18n/settings';
import { navigationData } from '@/utils/navigationData';
import { useUserStore } from '@/stores/userStore';
import { useGlobalStore } from '@/stores/globalStore';
import { Text } from '@mantine/core';
import NavigationItem from './NavbarNavigationItem';

interface NavbarNavigationProps {
  initialMetadata?: UserMetadata | null;
  initialIsVerified?: boolean | null;
  initialPermissions?: string[] | null;
  lng: string;
}

const NavbarNavigation = ({
  initialMetadata,
  initialIsVerified,
  initialPermissions,
  lng,
}: NavbarNavigationProps) => {
  const { t } = useTranslation(lng);
  const pathname = usePathname();
  const currentPath = pathname || '/';

  const {
    permissions: currentPermissions,
    userMetadata: currentMetadata,
    isVerified: currentIsVerified,
  } = useUserStore();

  const userMetadata = currentMetadata || initialMetadata;
  const isVerified = currentIsVerified || initialIsVerified;
  const permissions = currentPermissions || initialPermissions;

  const filteredNavigationData = useMemo(
    () =>
      navigationData(t, {
        userMetadata,
        isVerified,
        currentPath,
        permissions,
      }),
    [userMetadata, isVerified, currentPath, lng, permissions],
  );

  return useMemo(() => {
    if (!userMetadata) return null;
    return filteredNavigationData.map((item: any) => (
      <NavigationItem key={item.label} item={item} lng={lng} />
    ));
  }, [filteredNavigationData, permissions, lng, userMetadata]);
};

export default NavbarNavigation;
