import {
  every,
  filter,
  find,
  forEach,
  indexOf,
  map,
  some,
  sortBy,
  startsWith,
  take,
} from 'lodash';
import { Permission, UserPermission } from '../types';

export const getPermissionsTree = (permissions: Permission[]) => {
  const permissionNames = map(permissions, 'name');
  const tree: { label: string; value: string; children: any[] }[] = [];

  forEach(permissionNames, (key) => {
    const parts = key.split('.');
    let current = tree;

    forEach(parts, (part) => {
      const existing = find(current, { label: part });

      if (existing) {
        current = existing.children;
      } else {
        const newPart = {
          label: part,
          value: take(parts, indexOf(parts, part) + 1).join('.'),
          children: [],
        };

        current.push(newPart);
        current = newPart.children;
      }
    });
  });

  return sortBy(tree, (node) => node.label !== 'superadmin');
};

export const checkAllSubpermissionsActive = (
  node: string,
  userPermissions?: UserPermission[] | null,
  permissions?: Permission[],
) =>
  every(
    filter(permissions, (perm) => startsWith(perm.name, node)),
    (perm) => some(userPermissions, { name: perm.name }),
  );

export const isCheckboxIndeterminate = (
  node: string,
  userPermissions?: UserPermission[] | null,
  permissions?: Permission[],
) => {
  if (node === 'superadmin') return false;

  const atLeastOne = some(userPermissions, (perm) =>
    startsWith(perm.name, node),
  );

  const allActive = checkAllSubpermissionsActive(
    node,
    userPermissions,
    permissions,
  );

  return !allActive && atLeastOne;
};
