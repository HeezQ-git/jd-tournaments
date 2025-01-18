import { Tournament } from '@/types/tournaments';
import dayjs from 'dayjs';
import { groupBy, sortBy } from 'lodash';

export const sortTournaments = (tournaments?: Tournament[]) => {
  if (!tournaments) return [];

  return sortBy(tournaments, (tournament) =>
    dayjs(tournament.startDate).unix(),
  );
};

export const groupTournamentsByDate = (sortedTournaments: Tournament[]) => {
  if (!sortedTournaments) return [];

  const tournamentsByYear = groupBy(sortedTournaments, (tournament) =>
    dayjs(tournament.startDate).year(),
  );

  const sortedYears = Object.keys(tournamentsByYear)
    .map(Number)
    .sort((a, b) => a - b);

  const result = sortedYears.map((year) => {
    const tournaments = tournamentsByYear[year];
    const tournamentsByMonth = groupBy(
      tournaments,
      (tournament) => dayjs(tournament.startDate).month() + 1,
    );

    const sortedMonths = Object.keys(tournamentsByMonth)
      .map(Number)
      .sort((a, b) => a - b)
      .map((month) => [month, tournamentsByMonth[month]]);

    return [year, ...sortedMonths];
  });

  return result;
};
