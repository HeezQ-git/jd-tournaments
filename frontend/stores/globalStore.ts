import { create } from 'zustand';

interface GlobalStore {
  page: number;
  setPage: (page: number) => void;

  navbarMobileOpened: boolean;
  setNavbarMobileOpened: (opened: boolean) => void;

  navbarDesktopOpened: boolean;
  setNavbarDesktopOpened: (opened: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  page: 1,
  setPage: (page) => set({ page }),

  navbarMobileOpened: false,
  setNavbarMobileOpened: (navbarMobileOpened) => set({ navbarMobileOpened }),

  navbarDesktopOpened: true,
  setNavbarDesktopOpened: (navbarDesktopOpened) => set({ navbarDesktopOpened }),
}));
