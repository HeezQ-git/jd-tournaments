import {
  Badge,
  Box,
  Flex,
  Overlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import React from 'react';
import {
  TbArrowsShuffle,
  TbMusicPlus,
  TbPencil,
  TbPlaylist,
  TbSelect,
} from 'react-icons/tb';
import SongCardImage from '@/components/Admin/Songs/List/SongCard/SongCardImage';
import { find, join, map } from 'lodash';
import { songsEndpoints } from '@/app/api/endpoints';
import { getQueryData } from '@/app/api/apiFunctions';
import { Song } from '@/types/song';
import { useQuery } from '@tanstack/react-query';
import InfoField from '../InfoField';
import styles from '../CreatedTournaments.module.css';
import { useDrawerStore } from '../store/drawerStore';

const SongsSection = () => {
  const { tournament } = useDrawerStore();

  const { data: allSongs, isLoading: loadingSongs } = useQuery(
    getQueryData<Song[]>(songsEndpoints.getAll),
  );

  const songs = map(tournament?.songs, (songId) =>
    find(allSongs, { id: songId }),
  );

  return (
    <>
      <SimpleGrid cols={2} w="100%">
        <InfoField title="Songs amount" icon={<TbMusicPlus />}>
          <Tooltip
            label="Amount of songs / max amount of songs"
            position="top"
            withArrow
            events={{ hover: true, touch: true, focus: false }}
          >
            <Text span>
              {tournament?.songs.length}/{tournament?.maxSongs}
            </Text>
          </Tooltip>
        </InfoField>
        <InfoField title="Song selection" icon={<TbSelect />}>
          {tournament?.songSelection}
        </InfoField>
        <InfoField title="Random type" icon={<TbArrowsShuffle />}>
          {tournament?.randomType}
        </InfoField>
        <InfoField title="Fill gaps?" icon={<TbPencil />}>
          {tournament?.fillGapMode ? 'Yes' : 'No'}
        </InfoField>
      </SimpleGrid>
      <InfoField title="Selected songs" icon={<TbPlaylist />}>
        {songs?.length ? (
          <SimpleGrid w="100%" cols={{ base: 2, xs: 3, md: 4 }} mt="xs">
            {songs.map((song, index) => (
              <Paper
                key={song?.id}
                bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))"
                w="100%"
                withBorder
              >
                <Flex direction="column" gap="xs">
                  <Box className={styles.imageBox}>
                    <Box>
                      <SongCardImage
                        imagePath={song?.image_path!}
                        title={song?.title!}
                        isCard={false}
                        containerHeight={75}
                      />
                      <Overlay
                        gradient="linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, transparent 100%)"
                        zIndex={0}
                      />
                    </Box>
                    <Badge circle className={styles.badge}>
                      {index + 1}
                    </Badge>
                  </Box>
                  <Stack gap="0" px="6px" pb="xs" pt="0">
                    <Text fz="sm" truncate title={song?.title}>
                      {song?.title}
                    </Text>
                    <Text fz="sm" c="dimmed" truncate>
                      {join(song?.artists, ', ')}
                    </Text>
                  </Stack>
                </Flex>
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Text fs="italic" fz="sm">
            No songs selected.
          </Text>
        )}
      </InfoField>
    </>
  );
};

export default SongsSection;
