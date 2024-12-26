/* eslint-disable prettier/prettier */
import { FilterQuery, FilterQueryFields, useUserListStore } from '@/stores/userListStore';
import { User } from '@/types/user';
import { endsWith, eq, every, filter, includes, map, reverse, sortBy, startsWith, toLower, toPairsIn } from 'lodash';
import { useEffect } from 'react';

export const useHandleFilter = (users?: User[]) => {
  const { filters, setFilteredUsers, sortStatus } = useUserListStore();

  useEffect(() => {
    if (!users) return;

    const filteredUsers = filter(users ?? [], (item: User) => {
      const data = map(
        toPairsIn(filters),
        ([key, value]: [keyof User, FilterQuery[FilterQueryFields]]) => {
          // query - the value to search for, itemValue - the value of the item (user)
          let itemValue: string | undefined;

          if (typeof item[key] !== 'string') itemValue = item[key]?.toString();
          if (!(value?.isBoolean && value?.filter) && !value.query) return item;

          const query = value.caseSensitive
            ? value.query
            : toLower(value.query);
          itemValue = (value.caseSensitive
            ? item[key]
            : toLower(item[key] as string)) as string;

          switch (value.filter) {
            case 'startsWith':
              return startsWith(itemValue, query);
            case 'endsWith':
              return endsWith(itemValue, query);
            case 'contains':
              return includes(itemValue, query);
            case 'equals':
              return eq(itemValue, query);
            case 'notEquals':
              return !eq(itemValue, query);
            case 'boolTrue':
              return itemValue === 'true';
            case 'boolFalse':
              return itemValue === 'false';
            default:
              return item
                ? includes(item.username, value.query) ||
                includes(item.email, value.query)
                : false;
          }
        },
      );

      return every(data, Boolean);
    });

    let sortedUsers = sortBy(filteredUsers, sortStatus.columnAccessor);
    if (sortStatus.direction === 'desc') sortedUsers = reverse(sortedUsers);

    setFilteredUsers(sortedUsers);
  }, [users, filters, sortStatus]);
};
