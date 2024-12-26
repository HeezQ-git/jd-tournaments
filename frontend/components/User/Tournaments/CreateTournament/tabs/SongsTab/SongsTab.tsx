import { Divider, Flex, Group, Stack, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryData } from '@/app/api/apiFunctions';
import { songsEndpoints } from '@/app/api/endpoints';
import { Song } from '@/types/song';
import { TbMusicX } from 'react-icons/tb';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import MaxSongsInput from './MaxSongsInput';
import MaxSongsAlert from './MaxSongsAlert';
import RandomPickerMenu from './RandomPickerMenu';
import SelectedSongs from '../dndElements/SelectedSongs';
import OptionsAccordion from './OptionsAccordion';

const SongsTab = () => {
  const form = useTournamentsFormContext();
  const {
    songs: selectedSongs,
    songSelection,
    randomType,
    maxSongs,
  } = form.values;

  const isRandomBS = songSelection === 'random' && randomType === 'beforeStart';

  const { data } = useQuery(getQueryData<Song[]>(songsEndpoints.getAll));

  useEffect(() => {
    if (songSelection === 'random' && randomType !== 'now') {
      form.setFieldValue('songs', []);
    }
  }, [songSelection, randomType]);

  return (
    <Flex w="100%" direction="column" gap="md" pb="lg">
      <MaxSongsInput songs={data} />
      <OptionsAccordion songs={data} isRandomBS={isRandomBS} />
      <MaxSongsAlert key="maxSongsAlert" />
      <Divider
        label={`Selected songs${
          maxSongs
            ? ` (${selectedSongs?.length}/${maxSongs})`
            : ` (${selectedSongs?.length})`
        }`}
        mt="md"
      />
      <RandomPickerMenu songs={data} isRandomBS={isRandomBS} />
      <Stack>
        {selectedSongs?.length > 0 ? (
          <SelectedSongs songs={data} />
        ) : (
          <Group align="center" justify="center" gap="xs">
            <TbMusicX color="var(--mantine-color-dimmed)" />
            <Text c="dimmed" fz="sm">
              No songs selected, add some to the tournament
            </Text>
          </Group>
        )}
      </Stack>
    </Flex>
  );
};

export default SongsTab;
