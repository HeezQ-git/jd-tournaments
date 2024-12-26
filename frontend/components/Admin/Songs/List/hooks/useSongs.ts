import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { songsEndpoints } from '@/app/api/endpoints';
import { Song } from '@/types/song';
import { getQueryData } from '@/app/api/apiFunctions';
import { deburr, filter, includes, some, sortBy, toLower } from 'lodash';

const searchSongs = (song: Song, search: string): boolean => {
  const lowerSearch = toLower(deburr(search));

  return (
    includes(toLower(deburr(song.title)), lowerSearch) ||
    some(song.artists, (artist) =>
      includes(toLower(deburr(artist)), lowerSearch),
    ) ||
    some(['mode', 'difficulty', 'effort'], (key) =>
      includes(toLower((song as any)[key]), lowerSearch),
    )
  );
};

export const useSongs = (search: string) => {
  const { data: songs } = useSuspenseQuery(
    getQueryData<Song[]>(songsEndpoints.getAll),
  );

  const filteredSongs = useMemo(() => {
    const sortedSongs: Song[] = sortBy(songs, ['title', 'version']);
    if (!search) return sortedSongs;

    return filter(sortedSongs, (song) => searchSongs(song, search));
  }, [search, songs]);

  return { filteredSongs };
};
