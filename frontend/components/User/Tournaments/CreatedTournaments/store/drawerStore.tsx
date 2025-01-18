import { TournamentUser } from '@/stores/tournamentStore';
import { Tournament } from '@/types/tournaments';
import { create } from 'zustand';

interface DrawerStore {
  tournament: Tournament | null;
  setTournament: (t: Tournament | null) => void;

  users: TournamentUser[];
  setUsers: (u: TournamentUser[]) => void;
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  tournament: null,
  setTournament: (t) => set({ tournament: t }),

  users: [],
  setUsers: (u) => set({ users: u }),
}));
