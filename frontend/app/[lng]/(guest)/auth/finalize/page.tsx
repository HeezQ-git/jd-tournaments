'use client';

import Loading from '@/components/common/Loading/Loading';
import { useTranslation } from '@/i18n/client';
import ROUTES from '@/utils/routes';
import supabase from '@/utils/supabase/supabaseClient';
import { supabaseService } from '@/utils/supabase/supabaseService';
import { Flex } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

function AuthFinalize({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase().auth.getUser();

      if (!user?.id) return router.push(ROUTES.HOME);

      const { data } = await supabaseService
        .from('users')
        .select('username')
        .eq('id', user?.id)
        .single();

      let flag = false;

      if (user?.app_metadata.provider === 'email') {
        flag = true;
      } else if (user?.user_metadata?.username) return router.push(ROUTES.HOME);
      else flag = !data;

      if (flag) {
        let username: string | undefined;

        if (user.app_metadata.provider === 'discord') {
          username = user.user_metadata.full_name;
        } else if (user.app_metadata.provider === 'email' && !data) {
          username = user?.user_metadata?.username;
        }

        if (username) {
          await supabaseService.from('users').insert({ id: user.id, username });
          await supabase().auth.updateUser({
            data: { username },
          });
        }
      }

      router.push(ROUTES.HOME);
    })();
  }, []);

  return (
    <Flex h="100%" align="center" justify="center">
      <Loading text={t('checkingData')} />
    </Flex>
  );
}

export default AuthFinalize;
