import { ActionIcon, TextInput } from '@mantine/core';
import { TbMusicSearch, TbX } from 'react-icons/tb';

const SongSearchInput = ({
  search,
  setSearch,
  resetSearch,
  t,
}: {
  search: string;
  setSearch: (value: string) => void;
  resetSearch: () => void;
  t: any;
}) => (
  <TextInput
    placeholder={t('list.searchPlaceholder')}
    leftSection={<TbMusicSearch size={16} />}
    rightSection={
      search && (
        <ActionIcon variant="transparent" color="dark" onClick={resetSearch}>
          <TbX />
        </ActionIcon>
      )
    }
    defaultValue={search}
    onChange={(e) => setSearch(e.target.value)}
  />
);

export default SongSearchInput;
