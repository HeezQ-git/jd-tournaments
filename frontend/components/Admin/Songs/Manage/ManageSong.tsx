'use client';

import React, { useEffect } from 'react';
import { Flex, Paper, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/i18n/client';
import { songsEndpoints } from '@/app/api/endpoints';
import { zodResolver } from 'mantine-form-zod-resolver';
import { songSchema } from '@/validations/song';
import { Difficulty, Effort, Mode, Song } from '@/types/song';
import { getQueryData } from '@/app/api/apiFunctions';
import FormHeader from './FormHeader';
import SongDetailsForm from './SongDetailsForm';
import SubmitButtons from './SubmitButtons';
import { SongFormProvider, useSongForm } from './lib/formContext';
import ImageDropzone from './components/ImageDropzone';
import { onManageSongSubmit } from './lib/actionsHandler';

type Disctincts = 'tags' | 'artists' | 'game' | 'version' | 'exclusivity';

type SongsDataDistinct = {
  [key in Disctincts]: string[];
};

type ManageSongProps = {
  action: 'add' | 'edit';
  id?: string;
  lng: string;
};

const ManageSong = ({ action, id, lng }: ManageSongProps) => {
  const { t } = useTranslation(lng, 'songs');
  const router = useRouter();

  const { data: miscData, isLoading: loadingDistinct } = useQuery(
    getQueryData<SongsDataDistinct>(songsEndpoints.getDistinctData, {
      queryOptions: { staleTime: 1000 * 60 * 60 },
      params: { sort: 'asc' },
    }),
  );

  const {
    data: song,
    isLoading: loadingSongData,
    refetch: getSongData,
  } = useQuery(
    getQueryData<Song>(songsEndpoints.getSingle, {
      params: { id },
      dynamicKeys: [id],
      queryOptions: { enabled: !!id },
    }),
  );

  const loading = loadingDistinct || loadingSongData;

  const form = useSongForm({
    initialValues: {
      title: '',
      artists: [] as string[],
      duration: '',
      release_year: 0,
      mode: Mode.Solo,
      difficulty: Difficulty.Easy,
      effort: Effort.Chill,
      game: '',
      tags: [] as string[],
      exclusivity: '',
      version: '',
      jdplus_required: false,
      camera_supported: false,
      image_path: '',
    },
    validate: zodResolver(songSchema),
  });

  useEffect(() => {
    if (song) form.setValues({ ...song, duration: '' });
    if (song?.duration) {
      let minutes: number | string = Math.floor(song.duration / 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      const seconds = song.duration % 60;
      form.setFieldValue('duration', `${minutes}:${seconds}`);
    }
  }, [song]);

  return (
    <Flex align="center" direction="column" pt="xl" px="xs" pb="xl">
      <Stack maw="600" gap="lg">
        <FormHeader action={action} t={t} />
        <SongFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(
              onManageSongSubmit(action, router, t, song, id, getSongData),
            )}
          >
            <Flex direction="column" gap="md">
              <SongDetailsForm miscData={miscData} loading={loading} t={t} />
              <ImageDropzone t={t} />
              <SubmitButtons action={action} t={t} song={song} />
            </Flex>
          </form>
        </SongFormProvider>
      </Stack>
    </Flex>
  );
};

export default ManageSong;
