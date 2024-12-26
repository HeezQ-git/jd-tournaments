import { Badge, Center } from '@mantine/core';
import { useMemo } from 'react';

type RenderUserBadgeProps = {
  t: TransFunction;
  // touple [true, false]
  trans: [string, string];
  condition: boolean;
};

export const RenderUserBadge = ({
  t,
  trans,
  condition,
}: RenderUserBadgeProps) =>
  useMemo(
    () => (
      <Center>
        <Badge color={condition ? 'green.8' : 'red'} variant="light">
          {t(`list.status.${trans[condition ? 0 : 1]}`)}
        </Badge>
      </Center>
    ),
    [trans, condition],
  );
