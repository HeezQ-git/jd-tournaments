'use server';

import { getUserPermissions } from '@/utils/permissionHandler/getUserPermissions';
import { find, map } from 'lodash';
import { Permission } from '../types';

export const getUserPermissionList = async (
  userId: string,
  permissionList: Permission[],
) => {
  const { data: userPermissions } = await getUserPermissions(userId);

  const permissions = map(userPermissions, (perm) =>
    find(permissionList, { id: perm.permissions?.id }),
  );

  return (permissions as Permission[]) || [];
};
