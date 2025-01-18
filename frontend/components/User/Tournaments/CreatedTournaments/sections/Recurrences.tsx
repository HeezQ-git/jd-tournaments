import {
  Badge,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import React, { useMemo } from 'react';
import {
  TbCalendarEvent,
  TbClock,
  TbListCheck,
  TbRepeat,
} from 'react-icons/tb';
import { join, map } from 'lodash';
import dayjs from 'dayjs';
import {
  getNextMultipleRecurrenceDates,
  getNextRecurrenceDates,
} from '@/utils/recurrenceFunctions';
import { TournamentRecurrence } from '@/types/tournaments';
import InfoField from '../InfoField';
import styles from '../CreatedTournaments.module.css';
import { useDrawerStore } from '../store/drawerStore';

const RecurrencesSection = () => {
  const { tournament } = useDrawerStore();

  const recurrences = useMemo<TournamentRecurrence[]>(() => {
    if (!tournament?.recurrences) return [];

    return map(tournament.recurrences as string[], (r) => JSON.parse(r));
  }, [tournament?.recurrences]);

  const nextDates = useMemo(
    () =>
      tournament?.recurrence && recurrences
        ? getNextMultipleRecurrenceDates(recurrences || [], 3)
        : [],
    [recurrences],
  );

  return (
    <>
      <SimpleGrid cols={2}>
        <InfoField title="Recurrence" icon={<TbRepeat />}>
          {tournament?.recurrence ? 'Enabled' : 'Disabled'}
        </InfoField>
        <InfoField title="Next 3 dates" icon={<TbCalendarEvent />}>
          <Flex direction="column" gap="4px">
            {map(nextDates, (date, index) => (
              <Text key={index} fz="sm">
                {index + 1}. {date.format('DD/MM/YYYY HH:mm')}
              </Text>
            ))}
          </Flex>
        </InfoField>
      </SimpleGrid>
      <InfoField title="Recurrence rules" icon={<TbListCheck />}>
        {recurrences && recurrences.length > 0 ? (
          <Flex direction="column" w="100%" gap="md" mt="sm">
            {recurrences.map((recurrence, index) => (
              <Paper
                key={recurrence.id}
                p="xs"
                shadow="md"
                withBorder
                className={styles.recurrence}
              >
                <Badge
                  variant="filled"
                  color="teal"
                  size="xs"
                  radius="xl"
                  className={styles.badge}
                >
                  {index + 1}
                </Badge>
                <Flex justify="space-between">
                  <Stack w="100%" gap="xs">
                    <SimpleGrid cols={3}>
                      <InfoField title="Interval" icon={<TbRepeat />}>
                        {recurrence.interval} {recurrence.unit}
                      </InfoField>
                      <InfoField title="Time" icon={<TbClock />}>
                        {recurrence.time}
                      </InfoField>
                      {recurrence.unit === 'weeks' && (
                        <InfoField
                          title={
                            <Tooltip label="Days of the week">
                              <Text inherit span>
                                DOTW
                              </Text>
                            </Tooltip>
                          }
                          icon={<TbCalendarEvent />}
                        >
                          {join(
                            map(recurrence.daysOfWeek, (day) =>
                              dayjs().day(day).format('ddd'),
                            ),
                            ', ',
                          )}
                        </InfoField>
                      )}
                    </SimpleGrid>

                    <Text fz="sm" c="dimmed" span>
                      <Text inherit span>
                        Next 3 recurrences on:
                      </Text>
                      <Text inherit>
                        {map(
                          getNextRecurrenceDates(
                            3,
                            recurrence.interval,
                            recurrence.unit,
                            recurrence.daysOfWeek,
                            recurrence.excludedDays,
                            recurrence.time,
                          ),
                          (date) => date.format('ddd DD/MM/YYYY HH:mm'),
                        ).join('; ')}
                      </Text>
                    </Text>
                  </Stack>
                </Flex>
              </Paper>
            ))}
          </Flex>
        ) : (
          <Text fs="italic">No recurrence rules set.</Text>
        )}
      </InfoField>
    </>
  );
};
export default RecurrencesSection;
