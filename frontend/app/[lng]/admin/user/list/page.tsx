import NoAccessPage from '@/app/[lng]/(no-access)/NoAccess';
import { UserList } from '@/components/Admin/Users/List/UserList';
import { usePageProtection } from '@/hooks/usePageProtection';
import PERMISSIONS from '@/utils/permissions';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('user.list');
}

const UserListPage = async ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  if (!(await usePageProtection(PERMISSIONS.ACCESS.USERS.LIST)))
    return <NoAccessPage lng={lng} />;

  return <UserList lng={lng} />;
};

export default UserListPage;
