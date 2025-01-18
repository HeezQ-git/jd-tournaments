import { Flex, SimpleGrid, Text, Tooltip } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { TbClock, TbClockCancel, TbHourglassEmpty } from 'react-icons/tb';
import { getTournamentDuration } from '@/utils/utils';
import InfoField from '../InfoField';
import { useDrawerStore } from '../store/drawerStore';

const ScheduleSection = () => {
  const { tournament } = useDrawerStore();

  const [date, setDate] = useState(dayjs(tournament?.startDate).toDate());

  const endDate = dayjs(tournament?.startDate).add(
    tournament?.duration || 0,
    'seconds',
  );

  useEffect(() => {
    setDate(dayjs(tournament?.startDate).toDate());
  }, [tournament?.startDate]);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      <Flex justify={{ base: 'center', sm: 'flex-start' }}>
        <DatePicker
          type="range"
          date={date}
          onDateChange={setDate}
          value={[dayjs(tournament?.startDate).toDate(), endDate.toDate()]}
        />
      </Flex>
      <Flex
        gap={{ base: 'xs', sm: 'sm' }}
        direction={{ base: 'row', sm: 'column' }}
        justify={{ base: 'space-between', sm: 'space-around' }}
        w={{ base: '100%', sm: 'auto' }}
        wrap="wrap"
      >
        <InfoField title="Start date" icon={<TbClock />}>
          {dayjs(tournament?.startDate).format('DD/MM/YYYY HH:mm')}
        </InfoField>
        <InfoField title="End date" icon={<TbClockCancel />}>
          {endDate.format('DD/MM/YYYY HH:mm')}
        </InfoField>
        <InfoField title="Duration" icon={<TbHourglassEmpty />}>
          <Tooltip
            label="HH:mm:ss"
            position="top"
            withArrow
            events={{ hover: true, touch: true, focus: false }}
          >
            <Text span inherit>
              {getTournamentDuration(tournament?.duration || 0)}
            </Text>
          </Tooltip>
        </InfoField>
      </Flex>
    </SimpleGrid>
  );
};

export default ScheduleSection;
