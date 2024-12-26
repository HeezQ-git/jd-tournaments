import {
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { deburr, includes, map, slice, sortBy, toLower, trim } from 'lodash';
import React, { useState } from 'react';
import { Song } from '@/types/song';
import { notifications } from '@mantine/notifications';
import { TbSearch, TbX } from 'react-icons/tb';
import { useDebouncedState } from '@mantine/hooks';
import useDeepMemo from '@/hooks/useDeepMemo';
import { AnimatePresence } from 'framer-motion';
import SongCard from './SongCard';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import AnimatedItem from '../AnimatedItem';

const SongSelector = ({
  songs,
  isRandomBS,
}: {
  songs?: Song[];
  isRandomBS: boolean;
}) => {
  const form = useTournamentsFormContext();
  const { songs: selectedSongs, maxSongs, fillGapMode } = form.values;

  const [search, setSearch] = useState('');

  const filteredSongs = useDeepMemo(
    () =>
      songs?.filter((song) =>
        includes(toLower(deburr(song.title)), trim(toLower(search))),
      ),
    [songs, search],
  );

  return (
    <Stack gap="xs">
      <TextInput
        placeholder="Search songs..."
        leftSection={<TbSearch />}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <AnimatePresence>
        {filteredSongs?.length ? (
          <Checkbox.Group
            value={selectedSongs}
            onChange={(value) => {
              const limit = maxSongs ?? songs?.length ?? 0;
              const isOverLimit = value.length > limit;

              if (isOverLimit) return;
              if (isRandomBS) {
                if (!fillGapMode || !maxSongs) return;
                if (fillGapMode && value.length === (maxSongs ?? 0))
                  return notifications.show({
                    position: 'top-right',
                    title: 'Error',
                    message:
                      'At least one song must be selected randomly. Change the limit to select more songs manually.',
                    color: 'red',
                  });
              }

              form.setFieldValue('songs', value);
            }}
          >
            <SimpleGrid
              w="100%"
              cols={{ base: 1, xs: 3, sm: 3, md: 4, lg: 5 }}
              mt="xs"
            >
              <Tooltip.Group openDelay={700}>
                {slice(sortBy(filteredSongs, 'title'), 0, 10)?.map(
                  (song, index) => (
                    <SongCard key={song.id} index={index} song={song} />
                  ),
                )}
              </Tooltip.Group>
            </SimpleGrid>
          </Checkbox.Group>
        ) : (
          <AnimatedItem key="no-songs-found" animation="fadeUp" duration={0.1}>
            <Group
              align="center"
              justify="center"
              gap="6px"
              my="sm"
              style={{ userSelect: 'none' }}
            >
              <TbX color="var(--mantine-color-dimmed)" strokeWidth={3} />
              <Text c="dimmed" fz="sm">
                Uh oh! No songs found. Try searching for something else.
              </Text>
            </Group>
          </AnimatedItem>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default SongSelector;
