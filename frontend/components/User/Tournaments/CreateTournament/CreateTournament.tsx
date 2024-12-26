'use client';

import {
  ActionIcon,
  Badge,
  Breadcrumbs,
  Button,
  Flex,
  Group,
  rem,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { TbChevronLeft, TbDeviceFloppy, TbWorldUpload } from 'react-icons/tb';
import { includes, map } from 'lodash';
import { useMediaQuery } from '@mantine/hooks';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { getQueryData } from '@/app/api/apiFunctions';
import { tournamentsEndpoints } from '@/app/api/endpoints';
import { useQuery } from '@tanstack/react-query';
import { TournamentUser, useTournamentStore } from '@/stores/tournamentStore';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  TournamentsFormProvider,
  useTournamentsForm,
} from './tournamentsFormContext';
import UsersPanel from './tabs/dndElements/UsersPanel';
import TabPanels from './components/Tabs';
import { handleSaveChanges } from './lib/actionsHandler';

type DnDFields = 'initialParticipants' | 'organisers';

const CreateTournament = () => {
  const [active, setActive] = useState<string | null>('general');
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.md})`);
  const { setUsers, setLoadingUsers } = useTournamentStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const id = searchParams.get('id');

  const { data: userList, isLoading: loadingUsers } = useQuery(
    getQueryData<TournamentUser[]>(tournamentsEndpoints.getAllUsers),
  );

  const form = useTournamentsForm({
    initialValues: {
      title: `My tournament`,
      initialParticipants: [],
      organisers: [],
      startDate: dayjs().set('seconds', 0).toDate(),
      endDate: dayjs().add(1, 'day').toDate(),
      recurrence: false,
      songSelection: 'manual',
      songs: [],
      verificationMethod: 'both',
      platforms: ['switch'],
      cameraAllowed: false,
      livestreamLink: '',
      commentsAllowed: false,
      songsSuggestionsAllowed: false,
      isPrivate: false,
      isHidden: false,
      liveChat: false,
      isPublished: false,
    },
  });

  const handleUserDrag = (data: DropResult<string>) => {
    const { destination, source } = data;

    if (!destination) return;

    let userId = '';
    if (includes(data.draggableId, '#')) {
      [, userId] = data.draggableId.split('#');
    }

    if (source.droppableId === 'users') {
      const destinationId = destination.droppableId as DnDFields;
      if (includes(form.values[destinationId], userId)) return;

      const newOrganisers = [
        ...form.values[destinationId].slice(0, destination.index),
        userId,
        ...form.values[destinationId].slice(destination.index),
      ];

      form.setFieldValue(destinationId, newOrganisers);
    } else {
      const sourceId = source.droppableId as DnDFields;
      const destinationId = destination.droppableId as DnDFields;

      if (sourceId === destinationId) {
        const reorderedList = Array.from(form.values[sourceId]);
        const [movedItem] = reorderedList.splice(source.index, 1);
        reorderedList.splice(destination.index, 0, movedItem);

        form.setFieldValue(sourceId, reorderedList);
      }
    }
  };

  useEffect(() => {
    setLoadingUsers(loadingUsers);
    if (userList) setUsers(userList);
  }, [userList, loadingUsers]);

  useEffect(() => {
    if (tab) setActive(tab);
    if (id) form.setFieldValue('id', id);
  }, [tab, id]);

  useEffect(() => {
    let path = `${pathname}?tab=${active}`;
    if (form.values.id) path += `&id=${form.values.id}`;
    router.replace(path);
  }, [active, form.values.id]);

  return (
    <TournamentsFormProvider form={form}>
      <Flex
        w="100%"
        justify="center"
        gap={isMobile ? 'lg' : rem(48)}
        style={{ justifySelf: 'center', transition: 'all 0.2s ease' }}
        pt="xl"
      >
        <DragDropContext onDragEnd={handleUserDrag}>
          <Flex direction="column" gap="md" maw={850} style={{ flexGrow: 1 }}>
            <Stack gap={isMobile ? 'lg' : 'sm'}>
              <Flex align="center" justify="space-between">
                <Group align="center" gap="xs">
                  <ActionIcon
                    size="sm"
                    color="gray"
                    variant="light"
                    radius="xl"
                    onClick={() => router.back()}
                  >
                    <TbChevronLeft />
                  </ActionIcon>
                  <Flex
                    direction={isMobile ? 'column' : 'row'}
                    gap={isMobile ? '0' : 'md'}
                    align={isMobile ? 'flex-start' : 'center'}
                  >
                    <Text fw={600} fz="lg">
                      {form.values.id ? 'Edit' : 'Create'} tournament
                    </Text>
                    {form.values.id && (
                      <Badge variant="outline" color="white" size="xs">
                        Draft
                      </Badge>
                    )}
                  </Flex>
                </Group>
                <Group>
                  <Button.Group
                    orientation={isMobile ? 'vertical' : 'horizontal'}
                  >
                    <Button
                      variant="light"
                      leftSection={<TbDeviceFloppy />}
                      onClick={() => handleSaveChanges(form)}
                    >
                      Save changes
                    </Button>
                    <Button color="blue" leftSection={<TbWorldUpload />}>
                      Publish
                    </Button>
                  </Button.Group>
                </Group>
              </Flex>
              {!isMobile && (
                <Breadcrumbs separatorMargin="6px">
                  {map(
                    ['JDT', 'Tournaments', 'Create tournament', active],
                    (item: string, i: number) => (
                      <Text
                        fz="sm"
                        c={i !== 3 ? 'dimmed' : undefined}
                        key={item}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    ),
                  )}
                </Breadcrumbs>
              )}
            </Stack>
            <TabPanels active={active} setActive={setActive} />
          </Flex>
          <UsersPanel shouldShow={active === 'general'} />
        </DragDropContext>
      </Flex>
    </TournamentsFormProvider>
  );
};

export default CreateTournament;
