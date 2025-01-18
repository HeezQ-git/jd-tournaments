import { useUserStore } from '@/stores/userStore';
import { useMemo } from 'react';

export const useUserId = () => {
  const { userData } = useUserStore();

  return useMemo(() => userData?.id, [userData]);
};
