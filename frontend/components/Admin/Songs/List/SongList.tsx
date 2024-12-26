'use client';

import { Flex, Stack } from '@mantine/core';
import { useTranslation } from '@/i18n/client';
import SongListHeader from './SongListHeader';
import SongSearchInput from './SongSearchInput';
import SongGrid from './SongGrid';
import SongPagination from './SongPagination';
import { useSongs } from './hooks/useSongs';
import { usePagination } from './hooks/usePagination';
import { useSearch } from './hooks/useSearch';
import styles from './SongList.module.css';

const SongList = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng, 'songs');
  const { search, setSearch, resetSearch } = useSearch();

  const { filteredSongs } = useSongs(search);
  const { paginatedItems, page, setPage, totalPages } = usePagination(
    filteredSongs,
    6,
  );

  return (
    <Flex justify="center" py="xl">
      <Stack className={styles.container}>
        <SongListHeader t={t} />
        <SongSearchInput
          search={search}
          setSearch={setSearch}
          resetSearch={resetSearch}
          t={t}
        />
        <SongGrid songs={paginatedItems} search={search} t={t} lng={lng} />
        <SongPagination
          t={t}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </Stack>
    </Flex>
  );
};

export default SongList;
