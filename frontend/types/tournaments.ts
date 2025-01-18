import { Database } from '@/database.types';

/* eslint-disable prettier/prettier */
export type TournamentRecurrence = {
  id: string;
  interval: number;
  unit: 'days' | 'weeks' | 'months';
  time: string;
  daysOfWeek?: number[];
  excludedDays?: number[];
};
export type TimeLimit = Database['public']['Enums']['timelimit'];

export type Tournament = {
  id?: string;
  creatorId: string;
  title: string;
  description?: string;
  participants: string[];
  organisers: string[];
  startDate: Date;
  timeLimitedBy?: TimeLimit; // keep this
  endDate?: Date; // delete this
  duration?: number; // keep this (in minutes, convert songs duration and end date to this)
  recurrence?: boolean;
  recurrences?: TournamentRecurrence[] | string[];
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
