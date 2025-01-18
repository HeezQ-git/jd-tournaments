import { fetchAPI } from '@/app/api/apiFunctions';
import { tournamentsEndpoints, usersEndpoints } from '@/app/api/endpoints';
import { TournamentUser } from '@/stores/tournamentStore';
import { Tournament } from '@/types/tournaments';
import { getQueryClient } from '@/utils/getQueryClient';
import ROUTES from '@/utils/routes';
import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import dayjs from 'dayjs';
import { find, map, random, slice, toUpper } from 'lodash';
import Link from 'next/link';
import React, { useMemo } from 'react';
import {
  TbCalendarCancel,
  TbChevronDown,
  TbClockEdit,
  TbCloud,
  TbCloudOff,
  TbPencil,
} from 'react-icons/tb';
import styles from '../CreatedTournaments.module.css';
import { StatusBadge } from './StatusBadge';

const TournamentTile = ({
  tournament,
  users,
  open,
}: {
  tournament: Tournament;
  users?: TournamentUser[];
  open: () => void;
}) => {
  const usersAmount = tournament.organisers.length - 3;

  const organisers = map(tournament.organisers, (organiser) =>
    find(users, (u) => u.id === organiser),
  );

  const moreOrganisers = useMemo(
    () => (
      <Stack gap="0">
        <Text fz="xs">Co-organisers</Text>
        {map(slice(organisers, 3), (organiser) => (
          <Text key={organiser?.id} fz="sm" fw="bold">
            {organiser?.username}
          </Text>
        ))}
      </Stack>
    ),
    [organisers],
  );

  return useMemo(
    () => (
      <Paper
        w="100%"
        p="lg"
        shadow="xs"
        className={styles.tournament}
        onClick={open}
        onKeyDown={(e) => e.key === 'Enter' && open()}
        role="button"
        tabIndex={0}
      >
        <Flex gap="md" align="center">
          <Stack gap="0" align="center" px="sm" className={styles.date}>
            <Text fz="sm">
              {toUpper(dayjs(tournament.startDate).format('ddd'))}
            </Text>
            <Text fw="bold" fz="h2">
              {dayjs(tournament.startDate).format('DD')}
            </Text>
          </Stack>
          <Divider orientation="vertical" />
          <Flex direction="column" gap="4px" w="100%">
            <Flex align="center" justify="space-between" w="100%">
              <Text fw="500">{tournament.title}</Text>
              <StatusBadge isPublished={tournament.isPublished} />
            </Flex>
            <Flex justify="space-between" align="center">
              <Avatar.Group>
                {map(slice(organisers, 0, 3), (organiser, index) => (
                  <Tooltip
                    key={organiser?.id || random(0, 1000)}
                    label={
                      <Stack gap="0">
                        <Text fz="xs">
                          {index === 0 ? 'Organiser' : 'Co-organiser'}
                        </Text>
                        <Text fw="500" fz="sm" mt="-4px">
                          {organiser?.username}
                        </Text>
                      </Stack>
                    }
                    position="top"
                    withArrow
                  >
                    <Avatar size="sm" src={organiser?.avatar_url} />
                  </Tooltip>
                ))}
                {usersAmount > 0 && (
                  <Tooltip label={moreOrganisers} position="top" withArrow>
                    <Avatar size="sm" color="gray" radius="lg">
                      +{usersAmount}
                    </Avatar>
                  </Tooltip>
                )}
              </Avatar.Group>
              <Group gap="0" wrap="nowrap">
                <Button
                  variant="light"
                  color="orange"
                  leftSection={<TbPencil />}
                  size="xs"
                  className={styles.button}
                  component={Link}
                  href={`${ROUTES.USER.TOURNAMENT.CREATE}/${tournament.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Edit
                </Button>
                <Menu withinPortal>
                  <Menu.Target>
                    <ActionIcon
                      size={30}
                      color="orange"
                      variant="light"
                      className={styles.menuControl}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TbChevronDown />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown miw="175px">
                    <Menu.Item
                      leftSection={
                        tournament.isPublished ? (
                          <TbCloudOff color="var(--mantine-color-red-6)" />
                        ) : (
                          <TbCloud color="var(--mantine-color-blue-6)" />
                        )
                      }
                      onClick={async (e) => {
                        e.stopPropagation();

                        await fetchAPI(tournamentsEndpoints.setPublish, {
                          data: {
                            id: tournament.id,
                            isPublished: !tournament.isPublished,
                          },
                        });

                        getQueryClient().invalidateQueries({
                          queryKey: [usersEndpoints.getTournaments.key],
                        });
                      }}
                    >
                      {tournament.isPublished ? 'Unpublish' : 'Publish'}
                    </Menu.Item>
                    <Menu.Item
                      component={Link}
                      href={{
                        pathname: `${ROUTES.USER.TOURNAMENT.CREATE}/${tournament.id}`,
                        query: { tab: 'schedule' },
                      }}
                      leftSection={
                        <TbClockEdit color="var(--mantine-color-orange-6)" />
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      Reschedule
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item color="red" leftSection={<TbCalendarCancel />}>
                      Cancel event
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Flex>
          </Flex>
        </Flex>
      </Paper>
    ),
    [moreOrganisers, open, organisers, tournament],
  );
};

export default TournamentTile;
