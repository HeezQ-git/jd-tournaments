import { User, UserMetadata } from '@supabase/supabase-js';
import { create } from 'zustand';

interface UserStore {
  userMetadata?: UserMetadata | null;
  setUserMetadata: (userMetadata?: UserMetadata | null) => void;

  userData?: User | null;
  setUserData: (userData?: User | null) => void;

  isVerified?: boolean | null;
  setIsVerified: (isVerified?: boolean | null) => void;

  permissions?: string[] | null;
  setPermissions: (permissions?: string[] | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userMetadata: null,
  setUserMetadata: (userMetadata?: UserMetadata | null) =>
    set({ userMetadata }),

  userData: null,
  setUserData: (userData?: User | null) => set({ userData }),

  isVerified: null,
  setIsVerified: (isVerified?: boolean | null) => set({ isVerified }),

  permissions: null,
  setPermissions: (permissions?: string[] | null) => set({ permissions }),
}));
