/* eslint-disable func-names */
/* eslint-disable no-loop-func */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* recurrenceFunctions.ts */
/* eslint-disable prettier/prettier */
import dayjs from 'dayjs';
import { forEach } from 'lodash';
import { TournamentRecurrence } from '@/types/tournaments';
import { formatWithTime, isNotExcludedDay } from './recurrenceUtils';

/**
 * Generates the next occurrence dates for a recurrence.
 * @param amountOfDates The number of occurrence dates to generate.
 * @param interval The interval between occurrences (e.g., every 2 weeks).
 * @param unit The unit of time for the interval ('days', 'weeks', 'months').
 * @param daysOfWeek Optional array of numbers representing days of the week (0 = Sunday, 6 = Saturday).
 * @param excludedDays Optional array of numbers representing excluded days (0 = Sunday, 6 = Saturday).
 * @param time Optional time string in 'HH:mm' format to set for each occurrence.
 * @returns An array of Dayjs objects representing the next occurrence dates.
 */
export const getNextRecurrenceDates = (
  amountOfDates: number,
  interval: number,
  unit: 'days' | 'weeks' | 'months',
  daysOfWeek?: number[],
  excludedDays?: number[],
  time?: string,
): dayjs.Dayjs[] => {
  if (!Number.isInteger(amountOfDates) || amountOfDates <= 0) {
    throw new Error(`Invalid amountOfDates: ${amountOfDates}. Must be a positive integer.`);
  }

  if (!Number.isInteger(interval) || interval <= 0) {
    throw new Error(`Invalid interval: ${interval}. Must be a positive integer.`);
  }

  const validUnits = ['days', 'weeks', 'months'];
  if (!validUnits.includes(unit)) {
    throw new Error(`Invalid unit: ${unit}. Must be one of ${validUnits.join(', ')}.`);
  }

  if (unit === 'weeks') {
    if (!daysOfWeek || daysOfWeek.length === 0) {
      throw new Error(`daysOfWeek must be provided and non-empty for weekly recurrences.`);
    }
  }

  const dates: dayjs.Dayjs[] = [];
  let currentDate = dayjs();
  const maxIterations = amountOfDates * 10; // Prevent infinite loops
  let iterations = 0;

  const dateSet = new Set<string>();

  while (dates.length < amountOfDates && iterations < maxIterations) {
    iterations += 1;

    currentDate = currentDate.add(interval, unit);

    if (unit === 'weeks' && daysOfWeek && daysOfWeek.length > 0) {
      forEach(daysOfWeek, (day) => {
        let nextDate = currentDate.clone().day(day);

        if (nextDate.isBefore(currentDate)) {
          nextDate = nextDate.add(1, 'week');
        }

        if (!nextDate.isValid()) return;

        const dateStr = nextDate.format('YYYY-MM-DD HH:mm');
        if (
          isNotExcludedDay(nextDate, excludedDays) &&
          !dateSet.has(dateStr)
        ) {
          const formattedDate = formatWithTime(nextDate, time);
          if (formattedDate.isValid()) {
            dates.push(formattedDate);
            dateSet.add(formattedDate.format('YYYY-MM-DD HH:mm'));
          }
        }
      });
    } else if (isNotExcludedDay(currentDate, excludedDays)) {
      const formattedDate = formatWithTime(currentDate, time);
      const dateStr = formattedDate.format('YYYY-MM-DD HH:mm');
      if (formattedDate.isValid() && !dateSet.has(dateStr)) {
        dates.push(formattedDate);
        dateSet.add(dateStr);
      }
    }
  }

  if (iterations >= maxIterations) {
    console.warn(`Reached maximum iterations (${maxIterations}) without collecting all dates.`);
  }

  return dates
    .sort((a, b) => a.valueOf() - b.valueOf())
    .slice(0, amountOfDates);
};

/**
 * Generates the next occurrence dates for a recurrence.
 * @param recurrence The recurrence object.
 * @param maxDate The maximum date up to which to generate occurrences.
 * @returns A generator yielding Dayjs objects representing the next occurrence dates.
 */
export const generateRecurrenceDates = function* (
  recurrence: TournamentRecurrence,
  maxDate: dayjs.Dayjs
): Generator<dayjs.Dayjs> {
  let currentDate = dayjs();

  if (recurrence.unit === 'weeks') {
    if (!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0) {
      throw new Error(`Recurrence ID ${recurrence.id} is weekly but has no daysOfWeek specified.`);
    }

    const validDaysOfWeek = recurrence.daysOfWeek.every(day => Number.isInteger(day) && day >= 0 && day <= 6);
    if (!validDaysOfWeek) {
      throw new Error(`Recurrence ID ${recurrence.id} has invalid daysOfWeek: ${recurrence.daysOfWeek}. Must be integers between 0 and 6.`);
    }
  }

  if (!Number.isInteger(recurrence.interval) || recurrence.interval <= 0) {
    throw new Error(`Recurrence ID ${recurrence.id} has invalid interval: ${recurrence.interval}. Must be a positive integer.`);
  }

  while (currentDate.isBefore(maxDate)) {
    currentDate = currentDate.add(recurrence.interval, recurrence.unit);

    if (recurrence.unit === 'weeks' && recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
      for (const day of recurrence.daysOfWeek) {
        let nextDate = currentDate.clone().day(day);

        if (nextDate.isBefore(currentDate)) {
          nextDate = nextDate.add(1, 'week');
        }

        if (!nextDate.isValid()) continue;

        if (nextDate.isBefore(maxDate) && isNotExcludedDay(nextDate, recurrence.excludedDays)) {
          const formattedDate = formatWithTime(nextDate, recurrence.time);
          if (formattedDate.isValid()) {
            yield formattedDate;
          }
        }
      }
    } else if (isNotExcludedDay(currentDate, recurrence.excludedDays)) {
      const formattedDate = formatWithTime(currentDate, recurrence.time);
      if (formattedDate.isValid()) {
        yield formattedDate;
      }
    }
  }
};

/**
 * Combines multiple recurrences into a single, sorted list of dates with associated recurrences.
 * @param recurrences Array of recurrence objects to combine.
 * @param maxDate Optional maximum date up to which to combine occurrences. Defaults to one year from now.
 * @param limit Optional maximum number of combined dates to retrieve. Defaults to 10.
 * @returns An array of objects, each containing a date and the IDs of recurrences occurring on that date.
 */
export const combineRecurrences = (
  recurrences: TournamentRecurrence[],
  maxDate?: dayjs.Dayjs,
  limit: number = 10,
): Array<{ date: string; recurrenceIds: string[] }> => {
  // Input Validation
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(`Invalid limit: ${limit}. Must be a positive integer.`);
  }

  const MAX_MONTHS_AHEAD = 6;
  const finalMaxDate = maxDate || dayjs().add(MAX_MONTHS_AHEAD, 'months');

  const allOccurrences: Array<{ date: dayjs.Dayjs; id: string }> = [];

  recurrences.forEach((recurrence) => {
    try {
      // Calculate a reasonable number of dates to generate per recurrence
      // For example, (limit * 2) to account for overlaps and exclusions
      const generatedDates = getNextRecurrenceDates(
        limit * 2,
        recurrence.interval,
        recurrence.unit,
        recurrence.daysOfWeek,
        recurrence.excludedDays,
        recurrence.time,
      );

      generatedDates.forEach((date) => {
        if (date.isBefore(finalMaxDate)) {
          allOccurrences.push({
            date,
            id: recurrence.id,
          });
        }
      });
    } catch (error) {
      console.error(`Error generating dates for recurrence ID ${recurrence.id}:`, error);
    }
  });

  allOccurrences.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const aggregated: Array<{ date: string; recurrenceIds: string[] }> = [];
  let currentGroup: { date: string; recurrenceIds: string[] } | null = null;

  for (const occurrence of allOccurrences) {
    const dateStr = occurrence.date.format('YYYY-MM-DD HH:mm');

    if (!currentGroup || currentGroup.date !== dateStr) {
      // Start a new group
      if (currentGroup) {
        aggregated.push(currentGroup);
        if (aggregated.length >= limit) break;
      }
      currentGroup = {
        date: dateStr,
        recurrenceIds: [occurrence.id],
      };
    } else {
      // Add to the existing group
      currentGroup.recurrenceIds.push(occurrence.id);
    }
  }

  // Add the last group if limit not reached
  if (currentGroup && aggregated.length < limit) {
    aggregated.push(currentGroup);
  }

  return aggregated.slice(0, limit);
};

/**
 * Checks for overlaps among multiple recurrences within a specified time frame.
 * @param recurrences Array of recurrence objects to check.
 * @param maxDate Optional maximum date up to which to check for overlaps. Defaults to one year from now.
 * @param limit Optional maximum number of overlaps to retrieve. Defaults to 3.
 * @returns An object containing overlapping dates and the IDs of overlapping recurrences.
 */
export const checkRecurrenceOverlap = (
  recurrences: TournamentRecurrence[],
  maxDate?: dayjs.Dayjs,
  limit: number = 3,
): {
  dates: string[];
  overlappingRecurrenceIds: string[];
} => {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(`Invalid limit: ${limit}. Must be a positive integer.`);
  }

  const MAX_YEARS_AHEAD = 1;
  const finalMaxDate = maxDate || dayjs().add(MAX_YEARS_AHEAD, 'year');

  // Initialize generators for each recurrence
  const generators = recurrences.map((recurrence) => {
    try {
      const generator = generateRecurrenceDates(recurrence, finalMaxDate);
      const { value, done } = generator.next();
      return {
        id: recurrence.id,
        generator,
        next: !done ? value : null,
      };
    } catch (error) {
      console.error(`Error initializing generator for recurrence ID ${recurrence.id}:`, error);
      return {
        id: recurrence.id,
        generator: null,
        next: null,
      };
    }
  }).filter(gen => gen.generator !== null); // Exclude failed generators

  const overlappingDates: string[] = [];
  const overlappingRecurrenceIdsSet: Set<string> = new Set();

  while (
    generators.some((gen) => gen.next !== null) &&
    overlappingDates.length < limit
  ) {
    // Find the earliest next date
    const validGenerators = generators.filter((gen) => gen.next !== null);
    if (validGenerators.length === 0) break;

    const earliestDate = validGenerators.reduce((earliest, gen) =>
      gen.next!.isBefore(earliest) ? gen.next! : earliest
      , validGenerators[0].next!);

    // Find all generators that have this earliest date
    const overlappingGens = validGenerators.filter((gen) =>
      gen.next!.isSame(earliestDate)
    );

    // Record the overlap if more than one recurrence shares the date
    const dateStr = earliestDate.format('YYYY-MM-DD HH:mm');
    if (overlappingGens.length > 1) {
      overlappingDates.push(dateStr);
      overlappingGens.forEach((gen) => overlappingRecurrenceIdsSet.add(gen.id));

      if (overlappingDates.length >= limit) break;
    }

    // Advance each generator that had the earliest date
    overlappingGens.forEach((gen) => {
      try {
        const { value, done } = gen.generator.next();
        if (!done && value.isBefore(finalMaxDate)) {
          gen.next = value;
        } else {
          gen.next = null;
        }
      } catch (error) {
        console.error(`Error advancing generator for recurrence ID ${gen.id}:`, error);
        gen.next = null;
      }
    });
  }

  const overlappingRecurrenceIds = Array.from(overlappingRecurrenceIdsSet);

  return {
    dates: overlappingDates,
    overlappingRecurrenceIds,
  };
};
