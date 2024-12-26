import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import React from 'react';
import { Trans } from 'react-i18next';
import { TbTrash } from 'react-icons/tb';

type ConfirmDeleteModalProps = {
  t: TransFunction;
  user: { id: string; username: string };
  deleteUser: (id: string) => void;
};

export const openConfirmDeleteModal = ({
  t,
  user,
  deleteUser,
}: ConfirmDeleteModalProps) =>
  modals.openConfirmModal({
    title: t('list.dangerZone.confirmAction'),
    children: (
      <>
        <Text>
          <Trans
            t={t as any}
            i18nKey="list.dangerZone.deleteConfirm.message"
            components={{
              1: <Text c="red" span />,
              2: <Text fw={600} span />,
            }}
            values={{ username: user.username }}
          />
        </Text>
        <Text c="dimmed" fz="sm">
          <Trans
            t={t as any}
            i18nKey="list.dangerZone.deleteConfirm.warning"
            components={{ 1: <u /> }}
          />
        </Text>
      </>
    ),
    labels: {
      confirm: t('common:buttons.delete'),
      cancel: t('common:buttons.cancel'),
    },
    confirmProps: {
      color: 'red.8',
      leftSection: <TbTrash />,
    },
    onConfirm: () => deleteUser(user.id),
  });
