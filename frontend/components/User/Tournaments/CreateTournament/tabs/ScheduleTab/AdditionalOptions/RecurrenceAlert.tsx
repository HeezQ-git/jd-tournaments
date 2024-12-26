import { Alert } from '@mantine/core';
import { TbAlertCircle } from 'react-icons/tb';
import AnimatedItem from '../../AnimatedItem';

const RecurrenceAlert = ({ dates }: { dates: string[] }) => (
  <AnimatedItem animation="fadeIn" duration={0.15}>
    <Alert
      variant="light"
      color="red"
      title="Overlapping recurrences"
      icon={<TbAlertCircle />}
    >
      Hightlighted recurrences overlap with each other on: {dates.join('; ')}.
      Please adjust the recurrences to avoid overlapping as it may cause issues
      with scheduling.
    </Alert>
  </AnimatedItem>
);

export default RecurrenceAlert;
