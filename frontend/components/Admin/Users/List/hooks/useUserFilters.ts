import { User } from '@/types/user';
import { FilterQuery, useUserListStore } from '@/stores/userListStore';
import { set } from 'lodash';

export function useUserListFilters(users: User[], filters: FilterQuery) {
  const { setFilters } = useUserListStore();

  const updateField = (
    filterField: keyof FilterQuery,
    field: string,
    value: any,
  ) => {
    const newFilters = set({ ...filters }, `${filterField}.${field}`, value);
    setFilters(newFilters);
  };

  return { filters, updateField };
}
