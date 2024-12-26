import { ThemeIcon, Tooltip } from '@mantine/core';
import React from 'react';
import { TbQuestionMark } from 'react-icons/tb';

const ProvidersInfoTooltip = ({
  t,
  shouldShow,
}: {
  t: TransFunction;
  shouldShow: boolean;
}) => {
  if (!shouldShow) return null;

  return (
    <Tooltip label={t('providersInfo')} multiline w={350} position="bottom">
      <ThemeIcon
        size="xs"
        color="gray"
        bd="1px solid light-dark(var(--mantine-color-dark-3), var(--mantine-color-dark-2))"
        radius="xl"
        variant="light"
      >
        <TbQuestionMark size={14} strokeWidth={3} />
      </ThemeIcon>
    </Tooltip>
  );
};

export default ProvidersInfoTooltip;
