import { includes, isArray, isEmpty, some, startsWith } from 'lodash';

export const checkPermission = (
  permission: string | string[],
  permissions?: string[] | null,
  anyStartsWith?: boolean,
) => {
  if (isEmpty(permissions)) return false;
  if (includes(permissions, 'superadmin')) return true;

  if (isArray(permission)) {
    return some(permission, (perm) =>
      anyStartsWith
        ? some(permissions, (p) => startsWith(p, perm))
        : includes(permissions, perm),
    );
  }
  return anyStartsWith
    ? some(permissions, (p) => startsWith(p, permission))
    : includes(permissions, permission);
};
