'use client';

import React, { useEffect } from 'react';
import { User, UserMetadata } from '@supabase/supabase-js';
import { updateVerification } from '@/utils/storeFunctions';
import { useUserStore } from '@/stores/userStore';
import supabase from '@/utils/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import ROUTES from '@/utils/routes';
import { getUserPermissions } from '@/utils/permissionHandler/getUserPermissions';
import { map } from 'lodash';

interface UserDataProviderProps {
  children: React.ReactNode;
  initialUserMetadata?: UserMetadata;
  initialUserData?: User | null;
  initialIsVerified?: boolean | null;
  initialPermissions?: string[] | null;
}

const UserDataProvider: React.FC<UserDataProviderProps> = ({
  children,
  initialUserMetadata,
  initialUserData,
  initialIsVerified,
  initialPermissions,
}) => {
  const router = useRouter();
  const { setUserMetadata, setUserData, setIsVerified, setPermissions } =
    useUserStore();

  useEffect(() => {
    setUserMetadata(initialUserMetadata);
    setUserData(initialUserData);
    setIsVerified(initialIsVerified);
    setPermissions(initialPermissions);
  }, [
    initialUserMetadata,
    initialUserData,
    initialIsVerified,
    initialPermissions,
  ]);

  useEffect(() => {
    const { data } = supabase().auth.onAuthStateChange(
      async (event, session) => {
        let perms;
        switch (event) {
          case 'USER_UPDATED':
          case 'SIGNED_IN':
            setUserData(session?.user);
            setUserMetadata(session?.user?.user_metadata);
            updateVerification(
              setIsVerified,
              session?.user?.user_metadata?.username,
            );
            perms = await getUserPermissions(session?.user?.id as string);
            setPermissions(map(perms?.data, 'permissions.name'));
            break;
          case 'SIGNED_OUT':
            setUserData(null);
            setUserMetadata({});
            setIsVerified(null);
            setPermissions(null);
            router.push(ROUTES.GUEST.AUTH);
            break;
          default:
            break;
        }
      },
    );

    return () => data?.subscription.unsubscribe();
  }, []);

  return children;
};

export default UserDataProvider;
