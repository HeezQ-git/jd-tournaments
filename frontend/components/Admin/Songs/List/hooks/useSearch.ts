import { useDebouncedState } from '@mantine/hooks';

export const useSearch = () => {
  const [search, setSearch] = useDebouncedState('', 250);

  const resetSearch = () => setSearch('');

  return { search, setSearch, resetSearch };
};
