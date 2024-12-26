import { Badge, Checkbox, Flex, Group, Text } from '@mantine/core';
import React from 'react';
import clsx from 'clsx';
import {
  TournamentsFormValues,
  useTournamentsFormContext,
} from '../tournamentsFormContext';
import styles from '../CreateTournament.module.css';

const CheckboxCard = ({
  cardValue,
  recommended,
  name = 'timeLimitedBy',
  disallowDeselect,
  compact,
  onClick,
}: {
  cardValue: any;
  recommended?: boolean;
  name?: keyof TournamentsFormValues;
  disallowDeselect?: boolean;
  compact?: boolean;
  onClick?: () => void;
}) => {
  const form = useTournamentsFormContext();
  const value = form.values[name];

  return (
    <Checkbox.Card
      className={clsx(styles.root, compact && styles.compact)}
      radius="md"
      checked={value === cardValue}
      onClick={() => {
        if (!disallowDeselect && value === cardValue) {
          form.setValues({
            [name]: undefined,
            [cardValue]: undefined,
          });
          return;
        }

        form.setFieldValue(name, cardValue);
        onClick?.();
      }}
    >
      <Group wrap="nowrap" align="flex-start">
        <Checkbox.Indicator />
        <div>
          <Flex gap={{ base: 'md', sm: 'xs' }} align="center">
            <Text className={styles.label}>{cardValue}</Text>
            {recommended && (
              <Badge variant="light" size="xs">
                Recommended
              </Badge>
            )}
          </Flex>
          <Text className={styles.description}>
            Some refined description that is not yet ready
          </Text>
        </div>
      </Group>
    </Checkbox.Card>
  );
};

export default CheckboxCard;
