import NoAccessPage from '@/app/[lng]/(no-access)/NoAccess';
import ManageSong from '@/components/Admin/Songs/Manage/ManageSong';
import { usePageProtection } from '@/hooks/usePageProtection';
import PERMISSIONS from '@/utils/permissions';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('song.edit');
}

const EditSongPage = async ({
  params: { id, lng },
}: {
  params: { id: string; lng: string };
}) => {
  if (!(await usePageProtection(PERMISSIONS.ACCESS.SONGS.EDIT)))
    return <NoAccessPage lng={lng} />;

  return <ManageSong action="edit" lng={lng} id={id} />;
};

export default EditSongPage;
