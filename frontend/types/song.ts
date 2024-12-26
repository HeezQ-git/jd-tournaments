import { Database } from '@/database.types';

export type TMode = Database['public']['Enums']['mode'];
export const Mode = {
  Solo: 'Solo',
  Duet: 'Duet',
  Trio: 'Trio',
  Quartet: 'Quartet',
} as const;

export type TDifficulty = Database['public']['Enums']['difficulty'];
export const Difficulty = {
  Easy: 'Easy',
  Medium: 'Medium',
  Hard: 'Hard',
  Extreme: 'Extreme',
} as const;

export type TEffort = Database['public']['Enums']['effort'];
export const Effort = {
  Chill: 'Chill',
  Moderate: 'Moderate',
  Intense: 'Intense',
} as const;

export type Song = Database['public']['Tables']['songs']['Row'];
