import { TournamentRecurrence } from '@/types/tournaments';
import { Flex, MultiSelect, NumberInput, Select, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { isNaN, map, toNumber } from 'lodash';

const RecurrenceForm = ({
  recurrence,
  daysOfWeek,
  handleRecurrenceChange,
}: {
  recurrence: TournamentRecurrence;
  daysOfWeek: { label: string; value: string }[];
  handleRecurrenceChange: (
    recurrenceId: string,
    key: string,
    value: any,
  ) => void;
}) => (
  <Flex gap={{ base: 'xs', sm: 'sm' }} align="center">
    <Text>Repeat every</Text>
    <NumberInput
      size="xs"
      placeholder="Interval"
      value={recurrence.interval}
      w={75}
      onChange={(value) => {
        let newValue = toNumber(value);

        if (isNaN(newValue) || newValue < 1 || newValue > 100) newValue = 1;
        handleRecurrenceChange(recurrence.id, 'interval', newValue);
      }}
    />
    <Select
      size="xs"
      w={125}
      data={[
        { value: 'days', label: 'day(s)' },
        { value: 'weeks', label: 'week(s)' },
        { value: 'months', label: 'month(s)' },
      ]}
      placeholder="Unit"
      value={recurrence.unit}
      onChange={(value) => handleRecurrenceChange(recurrence.id, 'unit', value)}
    />
    <Text>at</Text>
    <TimeInput
      size="xs"
      value={recurrence.time}
      onChange={(e) =>
        handleRecurrenceChange(recurrence.id, 'time', e.target.value)
      }
    />
    {recurrence.unit === 'weeks' && (
      <>
        <Text>on</Text>
        <MultiSelect
          size="xs"
          miw={125}
          maw={275}
          data={daysOfWeek}
          value={map(recurrence.daysOfWeek, String)}
          onChange={(value) => {
            const newValues = map(value, toNumber);

            if (newValues.length === 0)
              return notifications.show({
                title: 'Error',
                message: 'At least one day of the week should be selected',
                color: 'red',
              });
            handleRecurrenceChange(recurrence.id, 'daysOfWeek', newValues);
          }}
        />
      </>
    )}
    {recurrence.unit === 'days' && (
      <>
        <Text>except</Text>
        <MultiSelect
          size="xs"
          miw={125}
          maw={275}
          data={daysOfWeek}
          value={map(recurrence.excludedDays, String)}
          onChange={(value) =>
            handleRecurrenceChange(
              recurrence.id,
              'excludedDays',
              map(value, toNumber),
            )
          }
        />
      </>
    )}
  </Flex>
);

export default RecurrenceForm;
