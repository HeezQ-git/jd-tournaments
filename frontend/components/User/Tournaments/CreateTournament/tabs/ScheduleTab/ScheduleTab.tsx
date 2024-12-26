import { Flex } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { TbCalendarPlus } from 'react-icons/tb';
import dayjs from 'dayjs';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import DurationSelector from './DurationSelector';
import AdditionalOptions from './AdditionalOptions/AdditionalOptions';
import AnimatedItem from '../AnimatedItem';

const ScheduleTab = () => {
  const form = useTournamentsFormContext();

  return (
    <Flex w="100%" direction="column" gap="md">
      <AnimatedItem delay={0.1}>
        <DateTimePicker
          w="100%"
          label="Start date & time"
          required
          leftSection={<TbCalendarPlus />}
          excludeDate={(date) => dayjs(date).isBefore(dayjs(), 'day')}
          {...form.getInputProps('startDate')}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.2}>
        <DurationSelector />
      </AnimatedItem>
      <AnimatedItem delay={0.3}>
        <AdditionalOptions />
      </AnimatedItem>
    </Flex>
  );
};

export default ScheduleTab;
