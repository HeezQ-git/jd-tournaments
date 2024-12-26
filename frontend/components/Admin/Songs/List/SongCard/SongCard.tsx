'use client';

import { Card, Stack, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { Song } from '@/types/song';
import React from 'react';

import SongCardImage from './SongCardImage';
import SongCardHeader from './SongCardHeader';
import SongCardActions from './SongCardActions';
import styles from '../SongList.module.css';

const variants = {
  show: { opacity: 1, y: 0 },
  hide: { opacity: 0, y: 20 },
};

const SongCard = ({
  song,
  index,
  search,
  t,
  lng,
}: {
  song: Song;
  index: number;
  search: string;
  t: TransFunction;
  lng: string;
}) => (
  <motion.div
    initial="hide"
    animate="show"
    transition={{ delay: index * 0.04, ease: 'easeOut' }}
    variants={variants}
    style={{ display: 'flex', justifyContent: 'center' }}
  >
    <Card
      shadow="md"
      padding="xs"
      radius="sm"
      withBorder
      className={styles.card}
    >
      <Stack gap="0" justify="space-between" h="100%">
        <Box>
          <SongCardImage imagePath={song.image_path} title={song.title} />
          <SongCardHeader
            title={song.title}
            artists={song.artists}
            search={search}
            t={t}
          />
        </Box>
        <SongCardActions song={song} t={t} lng={lng} />
      </Stack>
    </Card>
  </motion.div>
);

export default React.memo(SongCard);
