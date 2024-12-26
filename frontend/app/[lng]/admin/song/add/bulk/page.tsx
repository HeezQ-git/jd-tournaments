import NoAccessPage from '@/app/[lng]/(no-access)/NoAccess';
import BulkAddSongs from '@/components/Admin/Songs/BulkAdd/BulkAddSongs';
import { usePageProtection } from '@/hooks/usePageProtection';
import PERMISSIONS from '@/utils/permissions';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('song.bulkAdd');
}

const BulkAddSongsPage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  if (!(await usePageProtection(PERMISSIONS.ACCESS.SONGS.BULK_ADD)))
    return <NoAccessPage lng={lng} />;

  return <BulkAddSongs lng={lng} />;
};

export default BulkAddSongsPage;
