import React from 'react';
import { languages } from '@/i18n/settings';
import { useSupabaseServer } from '@/utils/supabase/supabaseSSR';
import ZustandProvider from '@/components/common/Providers/UserDataProvider/UserDataProvider';
import { getUserPermissions } from '@/utils/permissionHandler/getUserPermissions';
import { map } from 'lodash';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';
import dayjs from 'dayjs';
import DatesWrapper from '@/components/common/Providers/DatesWrapper/DatesWrapper';
import { fetchAPI } from '../api/apiFunctions';
import { verificationEndpoints } from '../api/endpoints';
import LayoutShell from './LayoutShell';
import 'dayjs/locale/en';
import 'dayjs/locale/pl';

[
  utc,
  timezone,
  isBetween,
  isSameOrAfter,
  isSameOrBefore,
  isToday,
  isTomorrow,
  isYesterday,
].forEach((plugin) => dayjs.extend(plugin));

type RootLayoutProps = {
  children: React.ReactNode;
  params: { lng: string };
};

export async function generateStaticParams() {
  return languages.map((lng: string) => ({ lng }));
}

async function RootLayout({ children, params: { lng } }: RootLayoutProps) {
  const supabase = useSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userMetadata = user?.user_metadata;
  let isVerified = null;
  let permissions = null;

  if (userMetadata?.username && user) {
    const data = await fetchAPI(verificationEndpoints.checkVerification, {
      params: { username: userMetadata?.username },
    });

    isVerified = data;

    permissions = await getUserPermissions(user?.id);
    permissions = map(permissions.data, 'permissions.name') as string[];

    dayjs.tz.setDefault(userMetadata?.timezone || dayjs.tz.guess());
  }

  return (
    <DatesWrapper lng={lng}>
      <ZustandProvider
        initialUserMetadata={userMetadata}
        initialIsVerified={isVerified}
        initialPermissions={permissions}
      >
        <LayoutShell
          lng={lng}
          isVerified={isVerified}
          metadata={userMetadata}
          permissions={permissions}
        >
          {children}
        </LayoutShell>
      </ZustandProvider>
    </DatesWrapper>
  );
}

export default RootLayout;
