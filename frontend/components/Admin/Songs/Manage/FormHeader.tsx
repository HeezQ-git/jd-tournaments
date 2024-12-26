import React, { useMemo } from 'react';
import { ActionIcon, Button, Group, Tooltip, Text, Flex } from '@mantine/core';
import Link from 'next/link';
import ROUTES from '@/utils/routes';
import { TbArrowBack, TbCode } from 'react-icons/tb';

type FormHeaderProps = {
  action: 'add' | 'edit';
  t: TransFunction;
};

const FormHeader: React.FC<FormHeaderProps> = ({ action, t }) =>
  useMemo(
    () => (
      <Flex justify="space-between">
        <Group>
          <Tooltip
            label={t('common:navigation.goBack')}
            position="top"
            openDelay={300}
          >
            <Link href={ROUTES.ADMIN.HOME}>
              <ActionIcon variant="light" radius="xl" color="gray">
                <TbArrowBack />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Text>{t(action === 'add' ? 'addSong' : 'editSong')}</Text>
        </Group>
        {action === 'add' && (
          <Link href={ROUTES.ADMIN.SONG.BULK_ADD}>
            <Button size="xs" variant="light" leftSection={<TbCode />}>
              {t('bulkAdd')}
            </Button>
          </Link>
        )}
      </Flex>
    ),
    [action],
  );

export default FormHeader;
