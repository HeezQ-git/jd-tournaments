/* eslint-disable camelcase */

'use client';

import { Song } from '@/types/song';
import ROUTES from '@/utils/routes';
import {
  ActionIcon,
  Button,
  Checkbox,
  Flex,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { songsEndpoints } from '@/app/api/endpoints';
import { useTranslation } from '@/i18n/client';
import { getQueryData } from '@/app/api/apiFunctions';
import { forEach, split } from 'lodash';
import { TbArrowBack, TbMusicPlus } from 'react-icons/tb';
import { onBulkAddSubmit } from './lib/actionHandler';

function BulkAddSongs({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'songs');

  const {
    isLoading: loadingSongs,
    data: allSongs,
    refetch: fetchSongs,
  } = useQuery(getQueryData<Song[]>(songsEndpoints.getAll));

  const form = useForm({
    initialValues: {
      songs: '',
      list_separator: '##',
      skip_duplicates: true,
    },
    validateInputOnChange: true,
    validate: {
      songs: (songs) => {
        if (!songs) {
          return t('bulk.fieldRequired');
        }

        const rows = songs.split('\n');
        const columns = 7;

        forEach(rows, (row) => {
          const splitRow = split(row, ';;');

          if (splitRow.length !== columns) {
            const text =
              splitRow.length < columns
                ? t('bulk.tooFewCols')
                : t('bulk.tooManyCols');

            return `${text} (${splitRow.length}/${columns}) - ${splitRow[0]}`;
          }
        });

        return null;
      },
    },
  });

  return (
    <Flex align="center" direction="column" pt="xl" px="xs">
      <Stack
        w="clamp(250px, 100%, 600px)"
        component="form"
        onSubmit={
          form.onSubmit(
            onBulkAddSubmit({
              t,
              allSongs: allSongs || [],
              fetchSongs,
            }),
          ) as any
        }
      >
        <Group>
          <Tooltip
            label={t('common:navigation.goBack')}
            position="top"
            openDelay={300}
          >
            <Link href={ROUTES.ADMIN.SONG.LIST}>
              <ActionIcon variant="light" radius="xl" color="gray">
                <TbArrowBack />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Text>{t('bulk.title')}</Text>
        </Group>
        <Stack gap="sm">
          <Stack gap="0">
            <Group gap="4">
              <Text fw="500" fz="sm">
                {t('bulk.format')}:
              </Text>
              <Text fz="sm">{t('bulk.formatExample')}</Text>
            </Group>
            <Text fz="sm" c="dimmed">
              {t('bulk.formatNote', {
                separator: form.values.list_separator,
              })}
            </Text>
          </Stack>
          <Textarea
            placeholder={t('bulk.placeholder')}
            autosize
            minRows={4}
            maxRows={8}
            resize="horizontal"
            disabled={loadingSongs || !allSongs?.length}
            {...form.getInputProps('songs')}
          />
          <TextInput
            label={t('bulk.listSeparator')}
            w="50%"
            {...form.getInputProps('list_separator')}
          />
          <Checkbox
            {...form.getInputProps('skip_duplicates', { type: 'checkbox' })}
            label={t('bulk.skipDuplicates')}
          />
          <Group w="100%" justify="flex-end">
            <Button
              type="submit"
              leftSection={<TbMusicPlus size={16} />}
              disabled={loadingSongs || !allSongs?.length}
            >
              {t('bulk.addSongs')}
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default BulkAddSongs;
