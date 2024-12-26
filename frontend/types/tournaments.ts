export type TournamentRecurrence = {
  id: string;
  interval: number;
  unit: 'days' | 'weeks' | 'months';
  time: string;
  daysOfWeek?: number[];
  excludedDays?: number[];
};
