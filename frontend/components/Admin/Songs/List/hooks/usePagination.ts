import { useGlobalStore } from '@/stores/globalStore';
import { useMemo } from 'react';

export const usePagination = (items: any[], itemsPerPage: number) => {
  const { page, setPage } = useGlobalStore();

  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage],
  );

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items?.slice(start, start + itemsPerPage) || [];
  }, [items, page, itemsPerPage]);

  return { paginatedItems, page, setPage, totalPages };
};
