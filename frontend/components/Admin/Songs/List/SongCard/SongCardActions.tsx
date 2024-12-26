'use client';

import { Button, Group, Popover, Stack, Text } from '@mantine/core';
import { songsEndpoints } from '@/app/api/endpoints';
import { getQueryClient } from '@/utils/getQueryClient';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';
import ROUTES from '@/utils/routes';
import { Trans } from 'react-i18next';
import { Song } from '@/types/song';
import { fetchAPI, getQueryData } from '@/app/api/apiFunctions';
import { useCallback, useMemo } from 'react';
import { useHasPermission } from '@/utils/permissionHandler/useHasPermission';
import PERMISSIONS from '@/utils/permissions';
import { TbEdit, TbTrash } from 'react-icons/tb';

const SongCardActions = ({
  song,
  t,
  lng,
}: {
  song: Song;
  t: TransFunction;
  lng: string;
}) => {
  const userPerms = useHasPermission([
    PERMISSIONS.SONGS.DELETE,
    PERMISSIONS.SONGS.EDIT,
  ]) as Record<string, boolean>;

  const handleDelete = useCallback(async (id: string) => {
    const status = await fetchAPI<number>(songsEndpoints.delete, {
      slugs: { id },
    });

    if (status === 204) {
      notifications.show({
        message: t('list.successDelete'),
        color: 'teal',
      });
    } else {
      notifications.show({ message: t('list.failedDelete'), color: 'red' });
    }

    await getQueryClient().invalidateQueries({
      queryKey: [songsEndpoints.getAll.key],
    });
  }, []);

  const PopoverDelete = useMemo(
    () => (
      <Popover trapFocus position="bottom" withArrow>
        <Popover.Target>
          <Button
            color="red"
            size="xs"
            variant="subtle"
            leftSection={<TbTrash size={16} />}
            disabled={!userPerms[PERMISSIONS.SONGS.DELETE]}
          >
            {t('list.buttons.delete')}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="xs">
            <Text fz="sm">
              <Trans
                t={t as any}
                i18nKey="list.confirmDelete"
                values={{ title: song?.title }}
                components={{ 1: <strong /> }}
              />
            </Text>
            <Button
              size="xs"
              color="red"
              variant="light"
              onClick={() => handleDelete(song?.id)}
            >
              {t('list.buttons.confirm')}
            </Button>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    ),
    [userPerms, song?.id],
  );

  const EditButton = useMemo(
    () => (
      <Link href={`${ROUTES.ADMIN.SONG.EDIT}/${song?.id}`} locale={lng}>
        <Button
          color="teal"
          size="xs"
          variant="light"
          leftSection={<TbEdit size={16} />}
          disabled={!userPerms[PERMISSIONS.SONGS.EDIT]}
          onMouseEnter={() => {
            getQueryClient().prefetchQuery(
              getQueryData(songsEndpoints.getSingle, {
                dynamicKeys: [song?.id],
                params: { id: song?.id },
              }),
            );
          }}
        >
          {t('list.buttons.edit')}
        </Button>
      </Link>
    ),
    [userPerms, song?.id],
  );

  return (
    <Group mt="sm" justify="space-between">
      {PopoverDelete}
      {EditButton}
    </Group>
  );
};

export default SongCardActions;
