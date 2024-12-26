import { create } from 'zustand';

export type TournamentUser = {
  id: string;
  username?: string;
  avatar_url?: string;
};

interface TournamentStore {
  users: TournamentUser[];
  setUsers: (users: TournamentUser[]) => void;

  loadingUsers: boolean;
  setLoadingUsers: (loading: boolean) => void;

  dragAndDrop: boolean;
  setDragAndDrop: (dragAndDrop: boolean) => void;
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),

  loadingUsers: true,
  setLoadingUsers: (loadingUsers) => set({ loadingUsers }),

  dragAndDrop: true,
  setDragAndDrop: (dragAndDrop) => set({ dragAndDrop }),
}));
