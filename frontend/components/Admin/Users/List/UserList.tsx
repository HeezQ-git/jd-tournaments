/* eslint-disable react/no-unstable-nested-components */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Flex, Alert, rem, Text, Group, Avatar } from '@mantine/core';
import { User } from '@/types/user';
import { useGlobalStore } from '@/stores/globalStore';
import { useMediaQuery } from '@mantine/hooks';
import { useDeleteUser } from '@/api/user/useDeleteUser';
import { useEditUser } from '@/api/user/useEditUser';
import { useTranslation } from '@/i18n/client';
import { useQuery } from '@tanstack/react-query';
import { usersEndpoints } from '@/app/api/endpoints';
import { DataTable } from 'mantine-datatable';
import useContextMenu from '@/components/common/ContextMenu/useContextMenu';
import ContextMenu, {
  ContextMenuData,
} from '@/components/common/ContextMenu/ContextMenu';
import { useUserListStore } from '@/stores/userListStore';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import { getQueryData } from '@/app/api/apiFunctions';
import NoPermissionWrapper from '@/components/common/NoPermissionWrapper/NoPermissionWrapper';
import { chunk, range } from 'lodash';
import { TbExclamationCircle } from 'react-icons/tb';
import { FieldFilterOption } from './FilterOption';
import { RenderUserBadge } from './UserBadge';
import { getContextMenuData } from './contextMenuData';
import { UserListHeader } from './UserListHeader';
import { useHandleFilter } from './hooks/useHandleFilter';

export const UserList = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng, 'users');
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);

  // stores & hooks
  const { page, setPage } = useGlobalStore();
  const {
    filteredUsers,
    selectedUsers,
    setSelectedUsers,
    sortStatus,
    setSortStatus,
  } = useUserListStore();

  const {
    showContextMenu,
    position,
    data: contextMenuData,
    opened,
    close: closeContextMenu,
    ref,
  } = useContextMenu();

  const {
    data: users,
    isLoading: loadingUsers,
    isFetching: fetchingUsers,
    refetch: getUsers,
    error: usersError,
  } = useQuery(getQueryData<User[]>(usersEndpoints.getAll));

  const loading = loadingUsers || fetchingUsers;
  useHandleFilter(users);

  const { mutate: deleteUser } = useDeleteUser(t);
  const { mutate: editUser } = useEditUser(t);

  // state
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // elements
  const ContextMenuElement = useMemo(
    () => (
      <ContextMenu
        data={contextMenuData}
        minWidth={200}
        top={position.top}
        left={position.left}
        close={closeContextMenu}
        opened={opened}
        ref={ref}
      />
    ),
    [contextMenuData, position, opened],
  );

  const MobileAlertElement = useMemo(
    () =>
      isMobile && (
        <Alert
          variant="filled"
          title={t('list.mobileWarningTitle')}
          color="red"
          radius={0}
          icon={<TbExclamationCircle size={20} />}
        >
          {t('list.mobileWarning')}
        </Alert>
      ),
    [isMobile],
  );

  const paginatedUsers = useMemo(
    () => chunk(filteredUsers || [], recordsPerPage),
    [filteredUsers, recordsPerPage],
  );

  // Reset page when component unmounts
  useEffect(() => () => setPage(1), []);

  return (
    <>
      {MobileAlertElement}
      <Flex
        w="100%"
        direction="column"
        pt={isMobile ? 'xl' : 100}
        align={isMobile ? 'flex-start' : 'center'}
        justify={isMobile ? 'flex-start' : 'center'}
      >
        <Flex direction="column" gap="md">
          <UserListHeader t={t} getUsers={getUsers} loadingUsers={loading} />
          <NoPermissionWrapper errors={[usersError]} lng={lng}>
            <DataTable
              striped
              withColumnBorders
              withRowBorders
              withTableBorder
              minHeight={rem(200)}
              fetching={loading}
              loadingText={t('list.loadingUsers')}
              noRecordsText={t('list.noResults')}
              recordsPerPageLabel={t('list.recordsPerPage')}
              highlightOnHover
              width="100%"
              records={paginatedUsers[page - 1] ?? []}
              totalRecords={users?.length ?? 0}
              page={page}
              onPageChange={setPage}
              recordsPerPage={recordsPerPage}
              recordsPerPageOptions={range(10, 31, 5)}
              onRecordsPerPageChange={(value) => {
                setRecordsPerPage(value);
                setPage(1);
              }}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              selectedRecords={selectedUsers}
              onSelectedRecordsChange={setSelectedUsers}
              onScroll={closeContextMenu}
              onRowContextMenu={({ record, event }) =>
                showContextMenu(
                  event,
                  getContextMenuData({
                    t,
                    record,
                    deleteUser,
                    editUser,
                  }) as ContextMenuData[],
                )
              }
              columns={[
                {
                  accessor: 'user',
                  sortable: true,
                  title: t('list.columns.user'),
                  filter: ({ close }) => (
                    <FieldFilterOption
                      fieldName="username"
                      t={t}
                      close={close}
                    />
                  ),
                  render: (item: User) => (
                    <Group gap="xs">
                      <Avatar size={26} src={item.avatar} radius={26} />
                      <Text size="sm" fw={500}>
                        {item.username}
                      </Text>
                    </Group>
                  ),
                },
                {
                  accessor: 'email',
                  title: t('list.columns.email'),
                  filter: ({ close }) => (
                    <FieldFilterOption fieldName="email" t={t} close={close} />
                  ),
                },
                {
                  accessor: 'is_active',
                  title: t('list.columns.active'),
                  sortable: true,
                  filter: ({ close }) => (
                    <FieldFilterOption
                      fieldName="is_active"
                      t={t}
                      close={close}
                      isBoolean
                    />
                  ),
                  render: (user: User) => (
                    <RenderUserBadge
                      t={t}
                      trans={['active', 'inactive']}
                      condition={!!user?.is_active}
                    />
                  ),
                },
                {
                  accessor: 'is_verified',
                  title: t('list.columns.verified'),
                  sortable: true,
                  filter: ({ close }) => (
                    <FieldFilterOption
                      fieldName="is_verified"
                      t={t}
                      close={close}
                      isBoolean
                    />
                  ),
                  render: (user: User) => (
                    <RenderUserBadge
                      t={t}
                      trans={['verified', 'unverified']}
                      condition={!!user?.is_verified}
                    />
                  ),
                },
              ]}
            />
          </NoPermissionWrapper>
          <Text c="dimmed" fz="xs" mt="-xs">
            {t('list.actionInfo')}
          </Text>
        </Flex>
      </Flex>
      {ContextMenuElement}
    </>
  );
};
