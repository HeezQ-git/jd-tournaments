import { fetchAPI } from '@/app/api/apiFunctions';
import { songsEndpoints } from '@/app/api/endpoints';

import { Song } from '@/types/song';
import { getQueryClient } from '@/utils/getQueryClient';
import { notifications } from '@mantine/notifications';
import { TbCheck, TbExclamationCircle } from 'react-icons/tb';

export const onBulkAddSubmit =
  ({
    t,
    allSongs,
    fetchSongs,
  }: {
    t: TransFunction;
    allSongs: Song[];
    fetchSongs: () => Promise<any>;
  }) =>
  async (values: any) => {
    let songs = values.songs?.split('\n').map((song: string) => {
      const [title, artists, releaseYear, mode, difficulty, effort, game] =
        song.split(';;');

      return {
        title,
        artists: artists.split(values.list_separator),
        release_year: releaseYear,
        mode,
        difficulty,
        effort,
        game,
      };
    });

    if (values.skip_duplicates) {
      const countBefore = songs.length;

      songs = songs.filter(
        (song: Song) => !allSongs?.some((s: Song) => s.title === song.title),
      );

      const countAfter = songs.length;
      const countSkipped = countBefore - countAfter;

      let text = t('bulk.skippedDuplicates', { count: countSkipped });

      if (!songs.length) {
        text = `${text} ${t('bulk.noSongsToAdd')}`;
        return notifications.show({
          message: text,
          color: 'red',
          autoClose: 3000,
        });
      }

      if (countSkipped > 0) {
        notifications.show({ message: text, color: 'blue', autoClose: 3000 });
      }
    }

    const text = t('bulk.addingSongs', { count: songs.length });
    let counter = 0;
    let isError = false;

    const id = notifications.show({
      message: text,
      color: 'blue',
      autoClose: 3000,
      loading: true,
    });

    // eslint-disable-next-line no-restricted-syntax
    for await (const song of songs) {
      try {
        counter += 1;
        notifications.update({
          id,
          message: t('bulk.addingSong', {
            count: counter,
            total: songs.length,
            title: song?.title,
          }),
          color: 'blue',
        });

        await fetchAPI(songsEndpoints.create, { data: song });
      } catch (error) {
        isError = true;
        notifications.show({
          message: t('bulk.failedToAdd', { title: song?.title }),
          color: 'red',
        });
      }
    }

    if (!isError) {
      notifications.update({
        id,
        message: t('bulk.songsAdded'),
        color: 'teal',
        loading: false,
        icon: <TbCheck strokeWidth={3} />,
      });
    } else {
      notifications.update({
        id,
        loading: false,
        message: t('bulk.finishedWithErrors'),
        icon: <TbExclamationCircle />,
        color: 'red',
      });
    }

    await fetchSongs();
    getQueryClient().invalidateQueries({
      queryKey: [songsEndpoints.getAll.key],
    });
  };
