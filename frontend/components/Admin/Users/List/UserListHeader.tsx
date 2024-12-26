import {
  ActionIcon,
  ActionIconGroup,
  Flex,
  Group,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import React, { useMemo } from 'react';
import { useUserListStore } from '@/stores/userListStore';
import { useDeleteUser } from '@/api/user/useDeleteUser';
import { TbRefresh, TbTrash, TbUserPlus } from 'react-icons/tb';
import { openConfirmDeleteSelectedModal } from './modals/ConfirmDeleteSelectedModal';

type UserListHeaderProps = {
  t: TransFunction;
  getUsers: (_?: any) => Promise<any>;
  loadingUsers: boolean;
};

export const UserListHeader = ({
  t,
  getUsers,
  loadingUsers,
}: UserListHeaderProps) => {
  const { selectedUsers, setSelectedUsers } = useUserListStore();
  const { mutate: deleteUser } = useDeleteUser(t);

  const AddUserButton = useMemo(
    () => (
      <Tooltip label={t('list.createUser')} withArrow openDelay={150}>
        <ActionIcon
          variant="light"
          size="lg"
          color="green.6"
          onClick={() =>
            modals.openContextModal({
              modal: 'manageUser',
              title: t('list.createUser'),
              centered: true,
              innerProps: { action: 'create' },
            })
          }
        >
          <TbUserPlus />
        </ActionIcon>
      </Tooltip>
    ),
    [],
  );

  const DeleteSelectedButton = useMemo(
    () => (
      <Tooltip label={t('list.deleteSelected')} withArrow openDelay={150}>
        <ActionIcon
          variant="light"
          size="lg"
          disabled={selectedUsers?.length <= 0}
          color="red"
          onClick={() =>
            openConfirmDeleteSelectedModal({
              t,
              deleteUser,
              selectedUsers,
              setSelectedUsers,
            })
          }
        >
          <TbTrash />
        </ActionIcon>
      </Tooltip>
    ),
    [selectedUsers, t],
  );

  const RefreshButton = useMemo(
    () => (
      <Tooltip label={t('list.refreshUsers')} withArrow openDelay={250}>
        <ActionIcon
          variant="light"
          color="gray"
          onClick={() => getUsers()}
          disabled={loadingUsers}
        >
          <TbRefresh />
        </ActionIcon>
      </Tooltip>
    ),
    [loadingUsers, t],
  );

  return (
    <Flex w="100%" align="center" justify="space-between">
      <Group>{RefreshButton}</Group>
      <Group>
        <ActionIconGroup>
          {AddUserButton}
          {DeleteSelectedButton}
        </ActionIconGroup>
      </Group>
    </Flex>
  );
};
