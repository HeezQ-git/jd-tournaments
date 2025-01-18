import { Button, Divider, Flex, Group, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryData } from '@/app/api/apiFunctions';
import { songsEndpoints } from '@/app/api/endpoints';
import { Song } from '@/types/song';
import { TbClearAll, TbClock, TbMusicX } from 'react-icons/tb';
import { getTournamentDuration } from '@/utils/utils';
import { find, map, reduce } from 'lodash';
import useDeepMemo from '@/hooks/useDeepMemo';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import MaxSongsInput from './MaxSongsInput';
import MaxSongsAlert from './MaxSongsAlert';
import RandomPickerMenu from './RandomPickerMenu';
import SelectedSongs from '../dndElements/SelectedSongs';
import OptionsAccordion from './OptionsAccordion';
import AnimatedItem from '../AnimatedItem';

const SongsTab = () => {
  const [songsDuration, setSongsDuration] = useState<number | null | undefined>(
    0,
  );

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

  useEffect(() => {
    const songsDuration = map(
      selectedSongs,
      (song) => find(data, (s) => s.id === song)?.duration,
    ).reduce((a, b) => (a || 0) + (b || 0), 0);

    setSongsDuration(songsDuration);
  }, [selectedSongs, data]);

  return (
    <Flex w="100%" direction="column" gap="md" pb="lg">
      <AnimatedItem>
        <MaxSongsInput songs={data} />
      </AnimatedItem>
      <AnimatedItem delay={0.05}>
        <OptionsAccordion songs={data} isRandomBS={isRandomBS} />
        <Group align="center" mt="xs" gap="xs" c="dimmed">
          <TbClock />
          <Text fz="sm" c="dimmed">
            Tournament duration based on selected songs:{' '}
            {getTournamentDuration(songsDuration || 0)}
          </Text>
        </Group>
      </AnimatedItem>
      <MaxSongsAlert key="maxSongsAlert" />
      <AnimatedItem delay={0.1}>
        <Divider
          label={`Selected songs${
            maxSongs
              ? ` (${selectedSongs?.length}/${maxSongs})`
              : ` (${selectedSongs?.length})`
          }`}
          mt="md"
        />
      </AnimatedItem>
      <AnimatedItem delay={0.15}>
        <Group w="100%" align="center" justify="center">
          <RandomPickerMenu songs={data} isRandomBS={isRandomBS} />
          <Button
            leftSection={<TbClearAll />}
            variant="light"
            color="red"
            size="xs"
            onClick={() => form.setFieldValue('songs', [])}
          >
            Clear list
          </Button>
        </Group>
      </AnimatedItem>
      <AnimatedItem delay={0.2}>
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
      </AnimatedItem>
    </Flex>
  );
};

export default SongsTab;
