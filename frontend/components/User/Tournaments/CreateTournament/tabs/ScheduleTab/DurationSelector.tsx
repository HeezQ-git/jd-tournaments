import { Divider, Flex, Group, NumberInput, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { TbCalendarMinus, TbMusic, TbX } from 'react-icons/tb';
import dayjs from 'dayjs';
import { floor } from 'lodash';
import {
  TimeLimit,
  useTournamentsFormContext,
} from '../../tournamentsFormContext';
import CheckboxCard from '../CheckboxCard';
import AnimatedItem from '../AnimatedItem';

const DurationEditor = ({ value }: { value?: TimeLimit }) => {
  const form = useTournamentsFormContext();
  let duration = 0;

  switch (value) {
    case 'endDate':
      return (
        <Flex gap="xs" direction="column">
          <DateTimePicker
            w="100%"
            label="End date & time"
            leftSection={<TbCalendarMinus />}
            excludeDate={(date) =>
              dayjs(date).isBefore(dayjs(form.values.startDate), 'day')
            }
            {...form.getInputProps('endDate')}
          />
          <Text c="dimmed" fz="sm">
            The tournament will last approximately{' '}
            {dayjs(form.values.endDate).diff(form.values.startDate, 'hours') ||
              0}{' '}
            hour(s).
          </Text>
        </Flex>
      );
    case 'duration':
      duration = form.values.duration || 0;

      return (
        <Flex direction="column" w="100%" gap="xs">
          <NumberInput
            label="Duration in minutes"
            variant="default"
            min={0}
            max={43200}
            {...form.getInputProps('duration')}
            onChange={(value) => {
              if (Number(value) > 43200)
                return form.setFieldValue('duration', 43200);
              if (Number(value) < 0) return form.setFieldValue('duration', 0);
              form.setFieldValue('duration', Number(value));
            }}
          />
          <Text c="dimmed" fz="sm">
            The tournament will last approximately {duration} minutes.{' '}
            {duration >= 60 ? `[~${floor(duration / 60, 0)} hour(s)]` : ''}
          </Text>
        </Flex>
      );
    case 'songs':
      return (
        <Group align="center" justify="center" gap="xs">
          <TbMusic color="var(--mantine-color-dimmed)" />
          <Text c="dimmed" fz="sm">
            Tournament duration will be calculated based on the selected songs.
          </Text>
        </Group>
      );
    default:
      return (
        <Group align="center" justify="center" gap="xs">
          <TbX strokeWidth={3} color="var(--mantine-color-dimmed)" />
          <Text c="dimmed" fz="sm">
            Tournament has no time limit. It will last until the last match is
            played.
          </Text>
        </Group>
      );
  }
};

const DurationSelector = () => {
  const form = useTournamentsFormContext();
  const { startDate, timeLimitedBy } = form.values;

  useEffect(() => {
    if (timeLimitedBy !== 'endDate') return;

    const startDate = dayjs(form.values.startDate);
    if (startDate.isAfter(form.values.endDate)) {
      form.setFieldValue('endDate', startDate.add(1, 'hour').toDate());
    }
  }, [startDate, timeLimitedBy]);

  return (
    <Flex direction="column" gap="md">
      <Divider label="Tourney duration defined by (optional)" mt="lg" />
      <Flex
        gap={{ base: 'xs', sm: 'md' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <CheckboxCard cardValue="songs" recommended />
        <CheckboxCard cardValue="endDate" />
        <CheckboxCard cardValue="duration" />
      </Flex>
      <AnimatedItem duration={0.15} delay={0} key={form.values.timeLimitedBy}>
        <DurationEditor value={form.values.timeLimitedBy} />
      </AnimatedItem>
    </Flex>
  );
};

export default DurationSelector;
