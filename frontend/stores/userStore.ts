import { UserMetadata } from '@supabase/supabase-js';
import { create } from 'zustand';

interface UserStore {
  userMetadata?: UserMetadata | null;
  setUserMetadata: (userMetadata?: UserMetadata | null) => void;

  isVerified?: boolean | null;
  setIsVerified: (isVerified?: boolean | null) => void;

  permissions?: string[] | null;
  setPermissions: (permissions?: string[] | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userMetadata: null,
  setUserMetadata: (userMetadata?: UserMetadata | null) =>
    set({ userMetadata }),

  isVerified: null,
  setIsVerified: (isVerified?: boolean | null) => set({ isVerified }),

  permissions: null,
  setPermissions: (permissions?: string[] | null) => set({ permissions }),
}));
