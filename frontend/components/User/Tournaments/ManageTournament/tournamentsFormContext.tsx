'use client';

import { TimeLimit, TournamentRecurrence } from '@/types/tournaments';
import { createFormContext } from '@mantine/form';

export type TournamentsFormValues = {
  id?: string;
  creatorId: string;
  title: string;
  description?: string;
  participants: string[];
  organisers: string[];
  startDate: Date;
  timeLimitedBy?: TimeLimit;
  endDate?: Date;
  duration?: number;
  recurrence?: boolean; // !
  recurrences?: TournamentRecurrence[];
  songSelection: 'random' | 'manual';
  randomType?: 'now' | 'beforeStart' | 'during';
  fillGapMode?: boolean;
  songs: string[]; // ! (with above)
  maxSongs?: number;
  verificationMethod: 'ocr' | 'manual' | 'both';
  platforms: string[];
  cameraAllowed: boolean;
  livestreamLink: string;
  commentsAllowed: boolean;
  songsSuggestionsAllowed: boolean;
  isPrivate: boolean;
  isHidden: boolean;
  liveChat: boolean;
  isPublished: boolean;
};

export const [
  TournamentsFormProvider,
  useTournamentsFormContext,
  useTournamentsForm,
] = createFormContext<TournamentsFormValues>();
