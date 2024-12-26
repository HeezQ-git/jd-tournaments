import { Divider, Flex } from '@mantine/core';
import React from 'react';
import supabase from '@/utils/supabase/supabaseClient';
import DiscordButton from '../DiscordButton';
import GoogleButton from '../GoogleButton';

const ProvidersButtons = ({
  t,
  shouldShow,
}: {
  t: TransFunction;
  shouldShow: boolean;
}) => {
  if (!shouldShow) return null;

  return (
    <>
      <Flex align="center" direction="column" gap="xs" mb="md" mt="sm">
        <DiscordButton
          t={t}
          radius="xl"
          onClick={async () => {
            await supabase().auth.signInWithOAuth({
              provider: 'discord',
              options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
              },
            });
          }}
        >
          {t('continueWith', { provider: 'Discord' })}
        </DiscordButton>
        <GoogleButton radius="xl" disabled>
          {t('continueWith', { provider: 'Google' })}
        </GoogleButton>
      </Flex>

      <Divider label={t('withEmail')} labelPosition="center" my="lg" />
    </>
  );
};

export default ProvidersButtons;
