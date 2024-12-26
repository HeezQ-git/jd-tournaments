/* eslint-disable react-hooks/rules-of-hooks */
import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { forEach } from 'lodash';
import React from 'react';
import { Trans } from 'react-i18next';
import { TbTrash } from 'react-icons/tb';

type ConfirmDeleteModalProps = {
  t: any;
  selectedUsers: any[];
  setSelectedUsers: (users: any[]) => void;
  deleteUser: any;
};

export const openConfirmDeleteSelectedModal = ({
  t,
  selectedUsers,
  setSelectedUsers,
  deleteUser,
}: ConfirmDeleteModalProps) =>
  modals.openConfirmModal({
    title: t('list.dangerZone.confirmAction'),
    children: (
      <>
        <Text>
          <Trans
            t={t as any}
            i18nKey="list.dangerZone.deleteSelected.message"
            components={{
              1: <Text c="red" span />,
              2: <Text fw={600} span />,
            }}
            values={{ amount: selectedUsers.length }}
          />
        </Text>
        <Text c="dimmed" fz="sm">
          <Trans
            t={t as any}
            i18nKey="list.dangerZone.deleteSelected.warning"
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
    onConfirm: async () => {
      forEach(selectedUsers, (user) => deleteUser(user.id));
      setSelectedUsers([]);

      notifications.show({
        message: t('list.dangerZone.deleteSelected.success', {
          amount: selectedUsers?.length || 0,
        }),
        color: 'teal',
      });
    },
  });
