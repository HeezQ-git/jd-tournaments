import { useTranslation } from '@/i18n/client';
import { Badge, Box, Button, ButtonProps, Flex } from '@mantine/core';
import React from 'react';
import { FaDiscord } from 'react-icons/fa';

export default function DiscordButton({
  t,
  ...props
}: ButtonProps &
  React.ComponentPropsWithoutRef<'button'> & { t: TransFunction }) {
  return (
    <Flex direction="column" align="center" gap="0" flex="1" w="100%">
      <Badge size="xs" variant="filled" opacity="0.7" color="#5865F2" mb="-6px">
        {t('recommended')}
      </Badge>
      <Button
        leftSection={<FaDiscord />}
        variant="light"
        color="#5865F2"
        fullWidth
        {...props}
      />
    </Flex>
  );
}
