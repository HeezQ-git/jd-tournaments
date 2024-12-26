import { includes, isArray, isEmpty, map, reduce } from 'lodash';
import { useUserStore } from '@/stores/userStore';
import PERMISSIONS from '../permissions';

type Permission = string;
type Permissions = Permission[];

export const useHasPermission = (
  permission: Permission | Permissions,
): boolean | Record<Permission, boolean> => {
  const { permissions } = useUserStore();

  if (isEmpty(permissions)) return false;

  if (isArray(permission)) {
    return reduce(
      permission,
      (acc, perm) => ({
        ...acc,
        [perm]:
          includes(permissions, perm) ||
          includes(permissions, PERMISSIONS.SUPERADMIN),
      }),
      {},
    );
  }
  return (
    includes(permissions, permission) ||
    includes(permissions, PERMISSIONS.SUPERADMIN)
  );
};
