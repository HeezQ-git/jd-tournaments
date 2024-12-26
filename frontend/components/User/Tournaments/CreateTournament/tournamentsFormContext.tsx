import { TournamentRecurrence } from '@/types/tournaments';
import { createFormContext } from '@mantine/form';

export type TimeLimit = 'endDate' | 'duration' | 'songs';

export type TournamentsFormValues = {
  id?: string;
  title: string;
  description?: string;
  initialParticipants: string[];
  organisers: string[];
  startDate: Date;
  timeLimitedBy?: TimeLimit;
  endDate?: Date;
  duration?: number;
  recurrence?: boolean;
  recurrences?: TournamentRecurrence[];
  songSelection: 'random' | 'manual';
  randomType?: 'now' | 'beforeStart' | 'during';
  fillGapMode?: boolean;
  songs: string[];
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
