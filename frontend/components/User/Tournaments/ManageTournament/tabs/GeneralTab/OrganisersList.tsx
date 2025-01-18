import React, { useEffect } from 'react';
import { Flex, Stack, Text } from '@mantine/core';
import { useTournamentStore } from '@/stores/tournamentStore';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import { useMediaQuery } from '@mantine/hooks';
import { useUserId } from '@/hooks/useUserId';
import UserListCombobox from './UserListCombobox';
import UsersDropzone from '../dndElements/UsersDropzone';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const OrganisersList = () => {
  const { dragAndDrop } = useTournamentStore();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);

  const form = useTournamentsFormContext();
  const userId = useUserId();

  useEffect(() => {
    if (!userId || form.values.organisers.length > 0) return;
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
