'use client';

import { getQueryData } from '@/app/api/apiFunctions';
import { tournamentsEndpoints, usersEndpoints } from '@/app/api/endpoints';
import { useUserId } from '@/hooks/useUserId';
import { Button, Divider, Flex, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TbArchiveOff, TbPlus } from 'react-icons/tb';
import { groupBy, map, sortBy } from 'lodash';
import dayjs from 'dayjs';
import { Tournament } from '@/types/tournaments';
import { TournamentUser } from '@/stores/tournamentStore';
import Link from 'next/link';
import ROUTES from '@/utils/routes';
import { useDisclosure } from '@mantine/hooks';
import TournamentDrawer from './TournamentDrawer';
import { useDrawerStore } from './store/drawerStore';
import TournamentTile from './components/TournamentTile';
import { TournamentSkeleton } from './components/TournamentSkeleton';
import { groupTournamentsByDate, sortTournaments } from './lib/utils';

const CreatedTournaments = () => {
  const { setUsers, setTournament } = useDrawerStore();

  const [opened, { open, close }] = useDisclosure(false);
  const userId = useUserId();

  const {
    data: tournaments,
    isLoading: loadingTournaments,
    isPending,
  } = useQuery(
    getQueryData<Tournament[]>(usersEndpoints.getTournaments, {
      params: { id: userId },
      dynamicKeys: [userId],
      queryOptions: { enabled: !!userId },
    }),
  );

  const { data: userList } = useQuery(
    getQueryData<TournamentUser[]>(tournamentsEndpoints.getAllUsers),
  );

  const sortedTournaments = useMemo(
    () => sortTournaments(tournaments),
    [tournaments],
  );

  // [year, [month, [tournament]]]
  const tournamentsByDate = useMemo(
    () => groupTournamentsByDate(sortedTournaments),
    [sortedTournaments],
  );

  useEffect(() => {
    if (userList) setUsers(userList);
  }, [userList]);

  return (
    <>
      <Flex direction="column" align="center" justify="center" w="100%" pb="xl">
        <Flex w="clamp(300px, 100%, 750px)" mt="md" direction="column" gap="lg">
          <Flex justify="space-between" w="100%" align="center">
            <Stack gap="0">
              <Text fw="500">My tournaments</Text>
              <Text fw="500" fz="sm" c="dimmed">
                Manage your tournaments with ease
              </Text>
            </Stack>
            <Button
              variant="light"
              leftSection={<TbPlus />}
              size="xs"
              color="gray"
              component={Link}
              href={ROUTES.USER.TOURNAMENT.CREATE}
            >
              Create tournament
            </Button>
          </Flex>
          {loadingTournaments || isPending ? (
            <>
              <Divider mb="lg" mt="sm" />
              <Flex direction="column" gap="lg">
                {map(Array(5).fill(0), (_, index) => (
                  <TournamentSkeleton key={index} index={index} />
                ))}
              </Flex>
            </>
          ) : tournaments?.length === 0 ? (
            <Flex
              align="center"
              justify="center"
              direction="column"
              gap="0"
              mt="lg"
            >
              <TbArchiveOff size={45} color="var(--mantine-color-dimmed)" />
              <Text ta="center" c="dimmed" fz="sm">
                You don&apos;t have any tournaments yet.
              </Text>
              <Text ta="center" c="dimmed" fz="sm">
                Create one to get started!
              </Text>
            </Flex>
          ) : (
            map(
              tournamentsByDate,
              ([year, ...months]: [number, [number, Tournament[]]]) => (
                <Flex key={year} direction="column" gap="0">
                  <Divider mb="lg" mt="sm" />
                  <Text fw="bold" fz="xl">
                    {year}
                  </Text>
                  {map(months, ([month, tournaments], index) => (
                    <Flex
                      key={month}
                      direction="column"
                      gap="lg"
                      mt={index > 0 ? 'xl' : undefined}
                    >
                      <Text fz="lg" mb="-xs">
                        {dayjs(`${year}-${month}`).format('MMMM')}
                      </Text>
                      {map(tournaments, (tournament) => (
                        <TournamentTile
                          key={tournament.id}
                          tournament={tournament}
                          users={userList}
                          open={() => {
                            setTournament(tournament);
                            open();
                          }}
                        />
                      ))}
                    </Flex>
                  ))}
                </Flex>
              ),
            )
          )}
        </Flex>
      </Flex>
      <TournamentDrawer opened={opened} close={close} />
    </>
  );
};

export default CreatedTournaments;
