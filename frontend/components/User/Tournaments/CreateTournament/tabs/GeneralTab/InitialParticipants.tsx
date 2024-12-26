import {
  Accordion,
  Flex,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import React from 'react';
import { TbQuestionMark, TbUsers } from 'react-icons/tb';
import { useTournamentStore } from '@/stores/tournamentStore';
import { useMediaQuery } from '@mantine/hooks';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import UsersDropzone from '../dndElements/UsersDropzone';
import UserListCombobox from './UserListCombobox';
import AccordionCustomControl from '../AccordionCustomControl';

const InitialParticipants = () => {
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);
  const { dragAndDrop } = useTournamentStore();

  return (
    <Accordion variant="separated">
      <Accordion.Item value="participants">
        <AccordionCustomControl
          title="Initial participants"
          // eslint-disable-next-line max-len
          tooltipLabel="Initial participants are users who will be automatically added to the tournament when it is created."
          icon={<TbUsers />}
        />
        <Accordion.Panel>
          {!isMobile && dragAndDrop ? (
            <UsersDropzone
              name="initialParticipants"
              disableSelfRemoval={false}
              text="Drop any user here"
            />
          ) : (
            <UserListCombobox name="initialParticipants" />
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default InitialParticipants;
