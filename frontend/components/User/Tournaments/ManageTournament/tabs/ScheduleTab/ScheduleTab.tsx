import { Flex } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import React from 'react';
import { TbCalendarPlus } from 'react-icons/tb';
import dayjs from 'dayjs';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import DurationSelector from './DurationSelector';
import AdditionalOptions from './AdditionalOptions/AdditionalOptions';
import AnimatedItem from '../AnimatedItem';

const ScheduleTab = ({ setActive }: { setActive: (value: string) => void }) => {
  const form = useTournamentsFormContext();

  return (
    <Flex w="100%" direction="column" gap="md">
      <AnimatedItem>
        <DateTimePicker
          w="100%"
          label="Start date & time"
          required
          leftSection={<TbCalendarPlus />}
          excludeDate={(date) => dayjs(date).isBefore(dayjs(), 'day')}
          {...form.getInputProps('startDate')}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.05}>
        <DurationSelector setActive={setActive} />
      </AnimatedItem>
      <AnimatedItem delay={0.1}>
        <AdditionalOptions />
      </AnimatedItem>
    </Flex>
  );
};

export default ScheduleTab;
