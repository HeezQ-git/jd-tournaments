'use client';

import { Group, Highlight, Tooltip, Badge } from '@mantine/core';

import styles from '../SongList.module.css';

const SongCardHeader = ({
  title,
  artists,
  search,
  t,
}: {
  title: string;
  artists: string[];
  search: string;
  t: TransFunction;
}) => (
  <>
    <Group
      justify="space-between"
      mt="md"
      gap="0"
      className={styles.upperContainer}
    >
      <Tooltip
        label={title}
        position="top"
        openDelay={300}
        disabled={title.length < 20}
        withArrow
      >
        <Highlight
          color="gold"
          highlight={search}
          fw="bolder"
          className={styles.title}
        >
          {title}
        </Highlight>
      </Tooltip>
      <Badge
        color={!title ? 'red.6' : 'green'}
        variant="filled"
        className={styles.badge}
      >
        {title ? 'OK' : 'IMG'}
      </Badge>
    </Group>
    <Highlight color="gold" highlight={search} fz="sm" fw="500" c="dimmed">
      {artists.join(', ')}
    </Highlight>
  </>
);

export default SongCardHeader;
