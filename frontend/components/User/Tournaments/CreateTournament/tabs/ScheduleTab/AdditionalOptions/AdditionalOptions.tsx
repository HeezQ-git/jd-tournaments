import { Accordion, Divider, Flex } from '@mantine/core';
import React from 'react';
import { TbCoffee, TbRepeat } from 'react-icons/tb';
import clsx from 'clsx';
import AccordionCustomControl from '../../AccordionCustomControl';
import RecurrencePanel from './RecurrencePanel';
import styles from '../ScheduleTab.module.css';
import { useTournamentsFormContext } from '../../../tournamentsFormContext';

const AdditionalOptions = () => {
  const form = useTournamentsFormContext();

  return (
    <Flex direction="column" gap="md">
      <Divider label="Additional options" mt="lg" />
      <Accordion variant="separated">
        <Accordion.Item
          value="recurrence"
          // bd="1px solid var(--mantine-color-teal-6)"
          className={clsx(
            styles.accordionItem,
            form.values.recurrence && styles.activeItem,
          )}
        >
          <AccordionCustomControl
            title="Recurrence"
            // eslint-disable-next-line max-len
            tooltipLabel="Recurrence allows you to repeat the tournament on a specified schedule. For example, you can set up a tournament to repeat every Monday and Wednesday."
            icon={<TbRepeat />}
          />
          <Accordion.Panel>
            <RecurrencePanel />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="breaks">
          <AccordionCustomControl
            title="Breaks"
            // eslint-disable-next-line max-len
            tooltipLabel="Breaks allow you to pause the tournament for a specified amount of time. For example, you can set up a 15-minute break after every 3 matches."
            icon={<TbCoffee />}
          />
          <Accordion.Panel>Allow breaks?</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Flex>
  );
};

export default AdditionalOptions;
