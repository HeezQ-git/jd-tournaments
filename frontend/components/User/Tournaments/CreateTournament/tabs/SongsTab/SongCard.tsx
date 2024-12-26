import { Song } from '@/types/song';
import supabaseLoader from '@/utils/supabase/imageLoader';
import {
  Box,
  Card,
  Checkbox,
  Flex,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import React from 'react';
import SongCardImage from '@/components/Admin/Songs/List/SongCard/SongCardImage';
import useDeepMemo from '@/hooks/useDeepMemo';
import styles from './SongsTab.module.css';
import AnimatedItem from '../AnimatedItem';

export const SongTitleAndArtists = ({
  song: { title, version, artists },
}: {
  song: Song;
}) => (
  <Stack gap="0" w="100%">
    <Text fz="sm" truncate>
      {title}
      <Text fz="xs" c="dimmed" span>
        {version ? ` (${version})` : ''}
      </Text>
    </Text>
    <Text fz="xs" c="dimmed" truncate>
      {artists.join(', ')}
    </Text>
  </Stack>
);

const SongCard = ({ song, index }: { song: Song; index: number }) =>
  useDeepMemo(
    () => (
      <AnimatedItem
        key={song.id}
        duration={0.15}
        delay={index * 0.02}
        animation="fadeIn"
      >
        <Tooltip withArrow label={<SongTitleAndArtists song={song} />}>
          <Checkbox.Card
            withBorder
            w="clamp(150px, 100%, 175px)"
            value={song.id}
            className={styles.songCard}
          >
            <Flex direction="column" h="100%" align="center" gap="xs">
              <Box pos="relative" w="100%" h="auto">
                <SongCardImage
                  imagePath={song.image_path}
                  title={song.title}
                  isCard={false}
                  containerHeight={100}
                />
                <Checkbox.Indicator pos="absolute" top="5px" left="5px" />
              </Box>

              <Flex w="100%" align="center" pb="xs" px="xs">
                <SongTitleAndArtists song={song} />
              </Flex>
            </Flex>
          </Checkbox.Card>
        </Tooltip>
      </AnimatedItem>
    ),
    [song],
  );

export default SongCard;
