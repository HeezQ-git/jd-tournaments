import React, { useEffect, useMemo } from 'react';
import { Flex, Stack, Text } from '@mantine/core';
import { useTournamentStore } from '@/stores/tournamentStore';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import { useMediaQuery } from '@mantine/hooks';
import { find } from 'lodash';
import { useUserStore } from '@/stores/userStore';
import UserListCombobox from './UserListCombobox';
import UsersDropzone from '../dndElements/UsersDropzone';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const OrganisersList = () => {
  const { users, dragAndDrop } = useTournamentStore();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);

  const form = useTournamentsFormContext();
  const { userMetadata } = useUserStore();
  const userId = useMemo(
    () => find(users, (user) => user.username === userMetadata?.username)?.id,
    [users, userMetadata],
  );

  useEffect(() => {
    if (!userId) return;
    form.setFieldValue('organisers', [userId]);
  }, [userId]);

  return (
    <Flex
      w="100%"
      direction="column"
      gap="xs"
      style={{ borderRadius: 4, overflow: 'hidden' }}
    >
      {dragAndDrop && !isMobile ? (
        <Stack gap="0">
          <Text fz="sm" fw="500">
            Co-organisers
          </Text>
          <UsersDropzone
            name="organisers"
            text="Drag and drop co-organisers here"
          />
        </Stack>
      ) : (
        <UserListCombobox name="organisers" userId={userId} />
      )}
    </Flex>
  );
};

export default OrganisersList;
