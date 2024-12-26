import { Accordion, Group, Text, ThemeIcon, Tooltip } from '@mantine/core';
import React from 'react';
import { TbQuestionMark, TbRepeat } from 'react-icons/tb';

const AccordionCustomControl = ({
  title,
  tooltipLabel,
  icon,
  disabled,
}: {
  title: string;
  tooltipLabel?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) => (
  <Accordion.Control disabled={disabled}>
    <Group>
      {icon}
      <Group gap="xs">
        <Text>{title}</Text>
        {tooltipLabel && (
          <Tooltip
            multiline
            openDelay={250}
            maw="350"
            events={{ hover: true, focus: true, touch: true }}
            // eslint-disable-next-line max-len
            label={tooltipLabel}
          >
            <ThemeIcon
              variant="light"
              radius="xl"
              color="gray"
              size="sm"
              tabIndex={0}
            >
              <TbQuestionMark />
            </ThemeIcon>
          </Tooltip>
        )}
      </Group>
    </Group>
  </Accordion.Control>
);

export default AccordionCustomControl;
