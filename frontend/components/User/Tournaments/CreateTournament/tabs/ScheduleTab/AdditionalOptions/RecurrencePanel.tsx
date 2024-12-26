import { Button, Checkbox, Flex, Text } from '@mantine/core';
import React, { useCallback } from 'react';
import { map, includes, filter, uniqueId } from 'lodash';
import useDeepMemo from '@/hooks/useDeepMemo';
import { checkRecurrenceOverlap } from '@/utils/recurrenceFunctions';
import dayjs from 'dayjs';
import { TbPlus } from 'react-icons/tb';
import { AnimatePresence, motion } from 'framer-motion';
import { useTournamentsFormContext } from '../../../tournamentsFormContext';
import RecurrenceItem from './RecurrenceItem';
import RecurrenceAlert from './RecurrenceAlert';
import AnimatedItem from '../../AnimatedItem';

const RecurrencePanel = () => {
  const form = useTournamentsFormContext();
  const { recurrences } = form.values;

  const daysOfWeek = [
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
    { value: '0', label: 'Sunday' },
  ];

  const handleRecurrenceChange = useCallback(
    (recurrenceId: string, key: string, value: any) => {
      if (key === 'remove') {
        form.setFieldValue(
          'recurrences',
          filter(recurrences, (rec) => rec.id !== recurrenceId),
        );
      } else {
        const updatedRecurrences = map(recurrences, (recurrence) =>
          recurrence.id === recurrenceId
            ? { ...recurrence, [key]: value }
            : recurrence,
        );
        form.setFieldValue('recurrences', updatedRecurrences);
      }
    },
    [form, JSON.stringify(recurrences)],
  );

  const recurrenceOverlapInfo = useDeepMemo(() => {
    if (!recurrences || recurrences.length === 0)
      return { dates: [], overlappingRecurrenceIds: [] };
    return checkRecurrenceOverlap(recurrences);
  }, [recurrences]);

  return (
    <Flex direction="column" gap="md">
      <Checkbox
        label="Enable recurrence"
        {...form.getInputProps('recurrence', { type: 'checkbox' })}
        mb={recurrences?.length ? 'md' : 0}
      />
      <AnimatePresence initial={false} presenceAffectsLayout mode="sync">
        {recurrences?.length ? (
          recurrences.map((recurrence, index) => (
            <RecurrenceItem
              key={recurrence.id}
              recurrence={recurrence}
              index={index}
              isOverlapping={includes(
                recurrenceOverlapInfo.overlappingRecurrenceIds,
                recurrence.id,
              )}
              daysOfWeek={daysOfWeek}
              handleRecurrenceChange={handleRecurrenceChange}
            />
          ))
        ) : (
          <AnimatedItem animation="fadeIn" duration={0.25} noExitAnimation>
            <Text c="dimmed" fz="sm">
              No recurrences set, click on the button below to add one
            </Text>
          </AnimatedItem>
        )}
        {recurrenceOverlapInfo.overlappingRecurrenceIds.length > 0 && (
          <RecurrenceAlert
            key="recurrence-alert"
            dates={map(recurrenceOverlapInfo.dates, (date) =>
              dayjs(date).format('ddd DD/MM/YYYY'),
            )}
          />
        )}
      </AnimatePresence>
      <Button
        variant="light"
        size="xs"
        leftSection={<TbPlus strokeWidth={3} />}
        onClick={() => {
          form.setFieldValue('recurrences', [
            ...(recurrences || []),
            {
              id: uniqueId(),
              interval: 1,
              unit: 'weeks',
              daysOfWeek: [dayjs(form.values.startDate).day()],
              time: dayjs(form.values.startDate).format('HH:mm'),
            },
          ]);
        }}
      >
        Add another recurrence
      </Button>
    </Flex>
  );
};

export default RecurrencePanel;
