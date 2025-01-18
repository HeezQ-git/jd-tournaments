'use server';

import { useSupabaseServer } from '../supabase/supabaseSSR';
import { getUserPermissions } from './getUserPermissions';

export const hasPermission = async (permission: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const supabase = useSupabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId)
    return {
      error: 'common:errors.permission.userNotFound',
      allowAction: false,
    };

  const { data: userPermissions, error } = await getUserPermissions(userId);

  if (error)
    return {
      error: 'common:errors.permission.permsNotFound',
      allowAction: false,
    };

  const mappedPermissions = userPermissions.map(
    (permission: any) => permission.permissions.name,
  );

  const allowAction =
    mappedPermissions.includes(permission) ||
    mappedPermissions.includes('superadmin');

  return {
    allowAction,
    error: !allowAction ? 'common:errors.permission.insufficient' : undefined,
  };
};
