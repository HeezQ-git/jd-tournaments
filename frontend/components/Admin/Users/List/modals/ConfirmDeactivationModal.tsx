import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import React from 'react';
import { Trans } from 'react-i18next';
import { TbPlugConnectedX } from 'react-icons/tb';

type ConfirmDeleteModalProps = {
  t: TransFunction;
  user: { id: string; username: string };
  editUser: (data: any) => void;
};

export const openConfirmDeactivationModal = ({
  t,
  user,
  editUser,
}: ConfirmDeleteModalProps) =>
  modals.openConfirmModal({
    title: t('list.dangerZone.confirmAction'),
    children: (
      <>
        <Text>
          <Trans
            t={t as any}
            i18nKey="list.dangerZone.deactivateConfirm.message"
            values={{ username: user.username }}
            components={{
              1: <Text fw={600} span />,
            }}
          />
        </Text>
        <Text c="dimmed" fz="sm">
          {t('list.dangerZone.deactivateConfirm.warning')}
        </Text>
      </>
    ),
    labels: {
      confirm: t('common:buttons.deactivate'),
      cancel: t('common:buttons.cancel'),
    },
    confirmProps: {
      color: 'red.8',
      leftSection: <TbPlugConnectedX />,
    },
    onConfirm: () =>
      editUser({
        id: user.id,
        is_active: false,
      }),
  });
