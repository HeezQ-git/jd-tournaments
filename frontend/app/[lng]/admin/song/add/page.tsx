import NoAccessPage from '@/app/[lng]/(no-access)/NoAccess';
import ManageSong from '@/components/Admin/Songs/Manage/ManageSong';
import { usePageProtection } from '@/hooks/usePageProtection';
import PERMISSIONS from '@/utils/permissions';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('song.add');
}

const AddSongPage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  if (!(await usePageProtection(PERMISSIONS.ACCESS.SONGS.ADD)))
    return <NoAccessPage lng={lng} />;

  return <ManageSong action="add" lng={lng} />;
};

export default AddSongPage;
