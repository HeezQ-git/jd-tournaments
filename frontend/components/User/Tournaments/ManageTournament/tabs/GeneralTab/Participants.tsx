import { Accordion } from '@mantine/core';
import React from 'react';
import { TbUsers } from 'react-icons/tb';
import { useTournamentStore } from '@/stores/tournamentStore';
import { useMediaQuery } from '@mantine/hooks';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import UsersDropzone from '../dndElements/UsersDropzone';
import UserListCombobox from './UserListCombobox';
import AccordionCustomControl from '../AccordionCustomControl';

const Participants = () => {
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);
  const { dragAndDrop } = useTournamentStore();

  return (
    <Accordion variant="separated">
      <Accordion.Item value="participants">
        <AccordionCustomControl
          title="Participants"
          // eslint-disable-next-line max-len
          tooltipLabel="You can add participants by typing their username or by dragging them from the list below"
          icon={<TbUsers />}
        />
        <Accordion.Panel>
          {!isMobile && dragAndDrop ? (
            <UsersDropzone
              name="participants"
              disableSelfRemoval={false}
              text="Drop any user here"
            />
          ) : (
            <UserListCombobox name="participants" />
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default Participants;
