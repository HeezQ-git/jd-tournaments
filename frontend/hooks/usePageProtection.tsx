'use server';

import { hasPermission } from '@/utils/permissionHandler/hasPermission';

export const usePageProtection = async (pagePermission: string) => {
  const { allowAction } = await hasPermission(pagePermission);

  return allowAction;
};
