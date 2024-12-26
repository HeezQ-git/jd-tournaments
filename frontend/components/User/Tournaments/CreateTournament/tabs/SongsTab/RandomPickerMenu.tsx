import React from 'react';
import { Button, Menu } from '@mantine/core';
import {
  TbArrowsShuffle,
  TbChevronDown,
  TbPlus,
  TbWritingSign,
} from 'react-icons/tb';
import { notifications } from '@mantine/notifications';
import { getRandomElements } from '@/utils/utils';
import { filter, map } from 'lodash';
import { Song } from '@/types/song';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const RandomPickerMenu = ({
  songs,
  isRandomBS,
}: {
  songs?: Song[];
  isRandomBS: boolean;
}) => {
  const form = useTournamentsFormContext();
  const { songs: selectedSongs, maxSongs, songSelection } = form.values;

  return songSelection === 'random' ? (
    <Menu>
      <Menu.Target>
        <Button
          leftSection={<TbArrowsShuffle />}
          rightSection={<TbChevronDown />}
          size="xs"
          color="orange"
          variant="light"
          disabled={!songs || !maxSongs}
        >
          Pick Random Songs
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          disabled={!selectedSongs.length}
          leftSection={<TbWritingSign color="var(--mantine-color-red-6)" />}
          onClick={() => {
            if (isRandomBS && !maxSongs)
              return notifications.show({
                position: 'top-right',
                title: 'Error',
                message: 'Set the max songs limit to add more songs',
                color: 'red',
              });

            const amountOfSongs =
              (isRandomBS ? (maxSongs ?? 0) - 1 : maxSongs) || 0;

            form.setFieldValue(
              'songs',
              map(getRandomElements(songs || [], amountOfSongs), 'id'),
            );
          }}
        >
          Overwrite current selection
        </Menu.Item>
        <Menu.Item
          leftSection={<TbPlus color="var(--mantine-color-teal-6)" />}
          onClick={() => {
            if (isRandomBS && !maxSongs)
              return notifications.show({
                position: 'top-right',
                title: 'Error',
                message: 'Set the max songs limit to add more songs',
                color: 'red',
              });

            const amountOfSongs =
              (isRandomBS ? (maxSongs ?? 0) - 1 : maxSongs) || 0;

            const songsToAdd = getRandomElements(
              filter(songs, (song) => !selectedSongs.includes(song.id)),
              amountOfSongs - selectedSongs.length,
            );
            form.setFieldValue('songs', [
              ...selectedSongs,
              ...map(songsToAdd, 'id'),
            ]);
          }}
        >
          Add to current selection
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : null;
};

export default RandomPickerMenu;
