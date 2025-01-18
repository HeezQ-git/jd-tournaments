import { getNextRecurrenceDates } from '@/utils/recurrenceFunctions';
import { ActionIcon, Badge, Flex, Paper, Stack, Text } from '@mantine/core';
import clsx from 'clsx';
import { map } from 'lodash';
import { TbX } from 'react-icons/tb';
import { TournamentRecurrence } from '@/types/tournaments';
import useDeepMemo from '@/hooks/useDeepMemo';
import RecurrenceForm from './RecurrenceForm';
import styles from '../ScheduleTab.module.css';
import AnimatedItem from '../../AnimatedItem';

const RecurrenceItem = ({
  recurrence,
  index,
  isOverlapping,
  daysOfWeek,
  handleRecurrenceChange,
}: {
  recurrence: TournamentRecurrence;
  index: number;
  isOverlapping: boolean;
  daysOfWeek: { label: string; value: string }[];
  handleRecurrenceChange: (
    recurrenceId: string,
    key: string,
    value?: any,
  ) => void;
}) => {
  const nextRecurrenceDates = useDeepMemo(
    () =>
      map(
        getNextRecurrenceDates(
          3,
          recurrence.interval,
          recurrence.unit,
          recurrence.daysOfWeek,
          recurrence.excludedDays,
        ),
        (date) => date.format('ddd DD/MM/YYYY'),
      ).join('; '),
    [recurrence],
  );

  return (
    <AnimatedItem animation="popIn" duration={0.15}>
      <Paper
        p="xs"
        shadow="sm"
        withBorder
        className={clsx(
          styles.recurrence,
          isOverlapping && styles.overlappingRecurrence,
        )}
      >
        <Badge
          variant="filled"
          color={isOverlapping ? 'red' : 'teal'}
          size="xs"
          radius="xl"
          className={styles.badge}
        >
          {index + 1}
        </Badge>
        <Flex justify="space-between">
          <Stack>
            <RecurrenceForm
              recurrence={recurrence}
              daysOfWeek={daysOfWeek}
              handleRecurrenceChange={handleRecurrenceChange}
            />
            <Text fz="sm" c="dimmed" span>
              <Text inherit span>
                Next 3 recurrences on:
              </Text>
              <Text inherit>{nextRecurrenceDates}</Text>
            </Text>
          </Stack>
          <ActionIcon
            size="sm"
            color="red"
            variant="light"
            onClick={() => handleRecurrenceChange(recurrence.id, 'remove')}
          >
            <TbX strokeWidth={3} />
          </ActionIcon>
        </Flex>
      </Paper>
    </AnimatedItem>
  );
};

export default RecurrenceItem;
