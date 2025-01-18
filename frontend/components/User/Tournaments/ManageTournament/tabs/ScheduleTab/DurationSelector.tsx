import {
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { TbCalendarMinus, TbMusic, TbMusicPlus, TbX } from 'react-icons/tb';
import dayjs from 'dayjs';
import { every, floor } from 'lodash';
import { TimeLimit } from '@/types/tournaments';
import { getTournamentDuration } from '@/utils/utils';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import CheckboxCard from '../CheckboxCard';
import AnimatedItem from '../AnimatedItem';

const DurationEditor = ({
  value,
  setActive,
}: {
  value?: TimeLimit;
  setActive: (value: string) => void;
}) => {
  const [durationData, setDurationData] = React.useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const form = useTournamentsFormContext();
  let duration = 0;

  useEffect(() => {
    if (value === 'duration') {
      duration = durationData.hours * 60 + durationData.minutes;
      duration = duration * 60 + durationData.seconds;
      form.setFieldValue('duration', duration);
    }
  }, [durationData]);

  useEffect(() => {
    if (
      value === 'duration' &&
      every(durationData, (value) => value === 0) &&
      form.values.duration !== 0
    ) {
      const duration = form.values.duration || 0;
      setDurationData({
        hours: Math.floor(duration / 3600),
        minutes: Math.floor((duration % 3600) / 60),
        seconds: duration % 60,
      });
    }
  }, [value, duration]);

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
            The tournament will last{' '}
            {getTournamentDuration(form.values.duration || 0)}.
          </Text>
        </Flex>
      );
    case 'duration':
      duration = form.values.duration || 0;

      return (
        <Flex direction="column" w="100%" gap="xs">
          <SimpleGrid cols={3}>
            <NumberInput
              label="Hours"
              variant="default"
              min={0}
              value={durationData.hours}
              onChange={(value) => {
                setDurationData((prev) => ({ ...prev, hours: Number(value) }));
              }}
            />
            <NumberInput
              label="Minutes"
              variant="default"
              min={0}
              max={59}
              value={durationData.minutes}
              onChange={(value) => {
                setDurationData((prev) => ({
                  ...prev,
                  minutes: Number(value),
                }));
              }}
            />
            <NumberInput
              label="Seconds"
              variant="default"
              min={0}
              max={59}
              value={durationData.seconds}
              onChange={(value) => {
                setDurationData((prev) => ({
                  ...prev,
                  seconds: Number(value),
                }));
              }}
            />
          </SimpleGrid>
        </Flex>
      );
    case 'songs':
      return (
        <Stack gap="xs" align="center">
          <Group align="center" justify="center" gap="xs">
            <TbMusic color="var(--mantine-color-dimmed)" />
            <Text c="dimmed" fz="sm">
              The duration will be calculated based on the songs selected.
            </Text>
          </Group>
          <Button
            variant="light"
            color="grape"
            miw="130"
            size="xs"
            leftSection={<TbMusicPlus />}
            onClick={() => setActive('songs')}
          >
            Select songs
          </Button>
        </Stack>
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

const DurationSelector = ({
  setActive,
}: {
  setActive: (value: string) => void;
}) => {
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
        <DurationEditor
          value={form.values.timeLimitedBy}
          setActive={setActive}
        />
      </AnimatedItem>
    </Flex>
  );
};

export default DurationSelector;
