import NoAccessPage from '@/app/[lng]/(no-access)/NoAccess';
import UserPermissions from '@/components/Admin/Users/Permissions/UserPermissions';
import { usePageProtection } from '@/hooks/usePageProtection';
import PERMISSIONS from '@/utils/permissions';
import { setPageTitle } from '@/utils/setPageTitle';
import React from 'react';

export async function generateMetadata() {
  return setPageTitle('user.permissions');
}

const UserPermissionsPage = async ({
  params: { id, lng },
}: {
  params: { id: string; lng: string };
}) => {
  if (!(await usePageProtection(PERMISSIONS.ACCESS.USERS.PERMISSIONS)))
    return <NoAccessPage lng={lng} />;

  return <UserPermissions userId={id} lng={lng} />;
};

export default UserPermissionsPage;
