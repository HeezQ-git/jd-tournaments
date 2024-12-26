'use client';

import ROUTES from '@/utils/routes';
import supabase from '@/utils/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const LogoutHandler = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await supabase().auth.signOut();
      router.push(ROUTES.GUEST.AUTH);
    })();
  }, []);

  return null;
};
