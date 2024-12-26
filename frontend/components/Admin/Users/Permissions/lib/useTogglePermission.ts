import { useCallback } from 'react';
import { differenceBy, eq, filter, some, startsWith, unionBy } from 'lodash';
import { Permission, UserPermission } from '../types';

interface Props {
  userPermissions: UserPermission[] | null;
  permissions?: Permission[];
  canGrantSuperadmin?: boolean | null;
  setUserPermissions: (permissions: UserPermission[]) => void;
}

const useTogglePermission = ({
  userPermissions,
  permissions,
  canGrantSuperadmin,
  setUserPermissions,
}: Props) => {
  const togglePermission = useCallback(
    (name: string) => {
      if (!userPermissions || !permissions) return;
      if (name === 'superadmin' && !canGrantSuperadmin) return;

      const subtreePermissions = filter(
        permissions,
        (perm) => eq(perm.name, name) || startsWith(perm.name, name),
      );

      if (subtreePermissions.length === 0) return;

      const activeSubPermissions = filter(userPermissions, (userPerm) =>
        some(subtreePermissions, { name: userPerm.name }),
      );

      const allActive = eq(
        activeSubPermissions.length,
        subtreePermissions.length,
      );

      if (allActive) {
        const updatedPermissions = differenceBy(
          userPermissions,
          subtreePermissions,
          'name',
        );
        setUserPermissions(updatedPermissions);
      } else {
        const updatedPermissions = unionBy(
          userPermissions,
          subtreePermissions,
          'name',
        );
        setUserPermissions(updatedPermissions);
      }
    },
    [userPermissions, permissions, canGrantSuperadmin, setUserPermissions],
  );

  return togglePermission;
};

export default useTogglePermission;
