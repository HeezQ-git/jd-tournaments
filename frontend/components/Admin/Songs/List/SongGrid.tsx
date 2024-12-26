import { SimpleGrid, Group, Text } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import { TbX } from 'react-icons/tb';

import SongCard from './SongCard/SongCard';

const SongGrid = ({
  songs,
  search,
  t,
  lng,
}: {
  songs: any[];
  search: string;
  t: TransFunction;
  lng: string;
}) => {
  if (!songs.length) {
    return (
      <Group
        justify="center"
        align="center"
        mt="xl"
        c="dimmed"
        fz="lg"
        gap="xs"
      >
        <TbX size={24} />
        <Text>{t('list.noSongs')}</Text>
      </Group>
    );
  }

  return (
    <SimpleGrid
      cols={{
        base: 1,
        sm: 2,
        md: 3,
      }}
    >
      <AnimatePresence initial={false}>
        {songs.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            search={search}
            index={i}
            t={t}
            lng={lng}
          />
        ))}
      </AnimatePresence>
    </SimpleGrid>
  );
};

export default SongGrid;
