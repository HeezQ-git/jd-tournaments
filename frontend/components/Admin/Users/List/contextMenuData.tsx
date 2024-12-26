import { User } from '@/types/user';
import { rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { MouseEvent } from 'react';
import ROUTES from '@/utils/routes';
import { setSlugs } from '@/utils/utils';
import {
  TbLock,
  TbPlugConnected,
  TbPlugConnectedX,
  TbTrash,
  TbUserEdit,
} from 'react-icons/tb';

import { openConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import { openConfirmDeactivationModal } from './modals/ConfirmDeactivationModal';

type ContextMenuDataProps = {
  t: TransFunction;
  record: User;
  editUser: (data: any) => void;
  deleteUser: (id: string) => void;
};

export const getContextMenuData = ({
  t,
  record: user,
  editUser,
  deleteUser,
}: ContextMenuDataProps) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks, react/display-name
  [
    {
      type: 'text',
      label: t('list.actions.header', {
        username: user.username,
      }),
    },
    {
      label: t('list.actions.edit'),
      onClick: () => {
        modals.openContextModal({
          modal: 'manageUser',
          title: t('list.editUser'),
          centered: true,
          innerProps: { action: 'edit', userData: user },
        });
      },
      icon: <TbUserEdit />,
    },
    {
      label: t('list.actions.permissions'),
      href: setSlugs(ROUTES.ADMIN.USER.PERMISSIONS, { id: user.id }),
      icon: <TbLock />,
    },
    { type: 'divider' },
    {
      type: 'text',
      label: t('list.dangerZone.header'),
    },
    {
      label: user.is_active
        ? t('list.dangerZone.deactivate')
        : t('list.dangerZone.activate'),
      onClick: (e: MouseEvent<HTMLButtonElement>) => {
        if (user.is_active && !e.shiftKey)
          return openConfirmDeactivationModal({
            t,
            user,
            editUser,
          });

        editUser({ id: user.id, is_active: !user.is_active });
      },
      icon: user.is_active ? (
        <TbPlugConnectedX width={rem(14)} height={rem(14)} />
      ) : (
        <TbPlugConnected width={rem(14)} height={rem(14)} />
      ),
    },
    {
      label: t('list.dangerZone.delete'),
      onClick: (e: MouseEvent<HTMLButtonElement>) => {
        if (e.shiftKey) return deleteUser(user.id);
        openConfirmDeleteModal({ t, user, deleteUser });
      },
      icon: <TbTrash />,
      color: 'red',
    },
  ];
