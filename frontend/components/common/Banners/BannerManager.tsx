'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import VerificationBanner from './VerificationBanner';
import { includes, some } from 'lodash';

function BannerManager({
  initialIsVerified,
}: {
  initialIsVerified?: boolean | null;
}) {
  const pathname = usePathname();
  const shouldHide = some(['/auth', '/verification', '/logout'], (path) =>
    includes(pathname, path),
  );

  const { isVerified: currentVerified } = useUserStore();
  const isVerified = initialIsVerified ?? currentVerified;

  const [opened, setOpened] = useState(
    initialIsVerified === false && !shouldHide,
  );

  useEffect(() => {
    if (shouldHide && initialIsVerified === false) return setOpened(false);
    if (isVerified === false && opened !== true) setOpened(true);
  }, [isVerified, pathname]);

  useEffect(() => {
    const height = opened ? '50px' : '0px';
    document.documentElement.style.setProperty('--banner-height', height);
  }, [opened]);

  if (!opened) return null;

  if (isVerified === false)
    return <VerificationBanner closeBanner={() => setOpened(false)} />;
  return null;
}

export default BannerManager;
