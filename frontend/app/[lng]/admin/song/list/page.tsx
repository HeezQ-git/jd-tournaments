'use server';

import NoAccessPage from '@/app/[lng]/(no-access)/NoAccess';
import { getQueryData } from '@/app/api/apiFunctions';
import { songsEndpoints } from '@/app/api/endpoints';
import SongList from '@/components/Admin/Songs/List/SongList';
import { usePageProtection } from '@/hooks/usePageProtection';
import { getQueryClient } from '@/utils/getQueryClient';
import PERMISSIONS from '@/utils/permissions';
import { setPageTitle } from '@/utils/setPageTitle';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('song.list');
}

const SongListPage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  if (!(await usePageProtection(PERMISSIONS.ACCESS.SONGS.LIST)))
    return <NoAccessPage lng={lng} />;

  const queryClient = getQueryClient();

  queryClient.prefetchQuery(getQueryData(songsEndpoints.getAll));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SongList lng={lng} />
    </HydrationBoundary>
  );
};

export default SongListPage;
