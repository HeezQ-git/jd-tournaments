import { User } from '@/types/user';
import { create } from 'zustand';

export type FilterQueryFields =
  | 'username'
  | 'email'
  | 'is_active'
  | 'is_verified';

export type FilterQuery = {
  [key in FilterQueryFields]: {
    query?: string;
    filter: string | null;
    caseSensitive?: boolean;
    isBoolean?: boolean;
  };
};

interface UserListStore {
  users: User[];
  setUsers: (users: User[]) => void;

  filteredUsers: User[] | null;
  setFilteredUsers: (users: User[] | null) => void;

  selectedUsers: User[];
  setSelectedUsers: (users: User[]) => void;

  filters: FilterQuery;
  setFilters: (filters: FilterQuery) => void;

  sortStatus: {
    columnAccessor: any;
    direction: 'asc' | 'desc';
  };
  setSortStatus: (sortStatus: {
    columnAccessor: any;
    direction: 'asc' | 'desc';
  }) => void;
}

export const useUserListStore = create<UserListStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),

  filteredUsers: null,
  setFilteredUsers: (users) => set({ filteredUsers: users }),

  selectedUsers: [],
  setSelectedUsers: (users) => set({ selectedUsers: users }),

  filters: {
    username: { query: '', filter: null, caseSensitive: false },
    email: { query: '', filter: null, caseSensitive: false },
    is_active: { filter: null, isBoolean: true },
    is_verified: { filter: null, isBoolean: true },
  },
  setFilters: (filters) => set({ filters }),

  sortStatus: {
    columnAccessor: 'username',
    direction: 'asc',
  },
  setSortStatus: (sortStatus) => set({ sortStatus }),
}));
