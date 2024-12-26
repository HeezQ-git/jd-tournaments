/* eslint-disable prettier/prettier */
import { includes } from 'lodash';
import dayjs from 'dayjs';

export const formatWithTime = (date: dayjs.Dayjs, time?: string): dayjs.Dayjs => {
  if (!time) return date;

  // Validate time format using a regex (HH:mm)
  const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    throw new Error(`Invalid time format: ${time}. Expected 'HH:mm'.`);
  }

  const combinedDate = dayjs(`${date.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');
  if (!combinedDate.isValid()) {
    throw new Error(`Invalid combined date and time: ${date} ${time}.`);
  }

  return combinedDate;
};

export const isNotExcludedDay = (date: dayjs.Dayjs, excludedDays?: number[]): boolean => {
  if (!excludedDays) return true;
  return !includes(excludedDays, date.day());
};
