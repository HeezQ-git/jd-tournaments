'use client';

import React from 'react';
import 'dayjs/locale/en';
import 'dayjs/locale/pl';
import { DatesProvider } from '@mantine/dates';
import dayjs from 'dayjs';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';

[
  utc,
  timezone,
  isBetween,
  isSameOrAfter,
  isSameOrBefore,
  isToday,
  isTomorrow,
  isYesterday,
].forEach((plugin) => dayjs.extend(plugin));

const DatesWrapper = ({
  lng,
  children,
}: {
  lng: string;
  children: React.ReactNode;
}) => (
  <DatesProvider
    settings={{
      locale: lng,
      timezone: dayjs.tz.guess(),
      consistentWeeks: true,
    }}
  >
    {children}
  </DatesProvider>
);

export default DatesWrapper;
