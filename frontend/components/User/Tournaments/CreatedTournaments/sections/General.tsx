import { Avatar, Paper, SimpleGrid, Text, Tooltip } from '@mantine/core';
import React from 'react';
import { TbFileDescription, TbUsers, TbUsersGroup } from 'react-icons/tb';
import { find, map } from 'lodash';
import DOMPurify from 'dompurify';
import InfoField from '../InfoField';
import { useDrawerStore } from '../store/drawerStore';

const GeneralSection = () => {
  const { tournament, users } = useDrawerStore();

  const organisers = map(tournament?.organisers, (organiserId) =>
    find(users, { id: organiserId }),
  );
  const participants = map(tournament?.participants, (participantId) =>
    find(users, { id: participantId }),
  );

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <InfoField title="Organisers" icon={<TbUsers />}>
          <Avatar.Group>
            <Tooltip.Group openDelay={600}>
              {organisers.map((organiser) => (
                <Tooltip
                  key={organiser?.id}
                  label={organiser?.username}
                  position="top"
                  withArrow
                  events={{ hover: true, touch: true, focus: true }}
                >
                  <Avatar src={organiser?.avatar_url} tabIndex={0} />
                </Tooltip>
              ))}
            </Tooltip.Group>
          </Avatar.Group>
        </InfoField>
        <InfoField title="Participants" icon={<TbUsersGroup />}>
          <Avatar.Group>
            <Tooltip.Group openDelay={600}>
              {participants.map((participant) => (
                <Tooltip
                  key={participant?.id}
                  label={participant?.username}
                  position="top"
                  withArrow
                  events={{ hover: true, touch: true, focus: true }}
                >
                  <Avatar src={participant?.avatar_url} tabIndex={0} />
                </Tooltip>
              ))}
            </Tooltip.Group>
          </Avatar.Group>
        </InfoField>
      </SimpleGrid>
      <InfoField title="Description" icon={<TbFileDescription />}>
        {tournament?.description && tournament.description !== '<p></p>' ? (
          <Paper
            p="xs"
            withBorder
            bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
            shadow="xs"
          >
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(tournament?.description),
              }}
            />
          </Paper>
        ) : (
          <Text fs="italic">No description provided.</Text>
        )}
      </InfoField>
    </>
  );
};

export default GeneralSection;
