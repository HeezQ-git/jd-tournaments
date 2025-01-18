import { tournamentsEndpoints } from '@/app/api/endpoints';
import { useUserStore } from '@/stores/userStore';
import {
  ActionIcon,
  Avatar,
  Combobox,
  Group,
  Loader,
  Paper,
  Pill,
  PillsInput,
  ScrollArea,
  Text,
  Tooltip,
  UnstyledButton,
  useCombobox,
} from '@mantine/core';
import { useDebouncedState, useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { filter, find, includes, map, orderBy, slice, toLower } from 'lodash';
import { useMemo } from 'react';
import { TbSwitch2, TbX } from 'react-icons/tb';
import { getQueryData } from '@/app/api/apiFunctions';
import { useTournamentStore } from '@/stores/tournamentStore';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

type User = {
  id: string;
  username?: string;
  avatar_url?: string;
};

const UserListCombobox = ({
  userId,
  name,
  disableSelfRemoval = true,
}: {
  userId?: string;
  name: string;
  disableSelfRemoval?: boolean;
}) => {
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);

  const { data: users, isLoading: loadingUsers } = useQuery(
    getQueryData<User[]>(tournamentsEndpoints.getAllUsers),
  );

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const { dragAndDrop, setDragAndDrop } = useTournamentStore();
  const form = useTournamentsFormContext();
  const userList = (form.values as any)[name] as string[];

  const [search, setSearch] = useDebouncedState('', 250);

  const handleValueSelect = (val: string) =>
    form.setFieldValue(
      name,
      includes(userList, val)
        ? filter(userList, (v) => v !== val)
        : [...userList, val],
    );

  const handleValueRemove = (val: string) =>
    form.setFieldValue(
      name,
      filter(userList, (v) => v !== val),
    );

  const values = map(userList, (val) => (
    <UnstyledButton
      key={val}
      onClick={(e) => {
        e.stopPropagation();
        handleValueRemove(val);
      }}
      disabled={userId === val}
      opacity={userId === val ? 0.75 : 1}
    >
      <Paper py="4px" px="8px" withBorder>
        <Group gap="xs" align="center">
          <Avatar
            src={find(users, (user) => user.id === val)?.avatar_url}
            size={20}
          />
          <Text fz="sm">
            {find(users, (user) => user.id === val)?.username}
          </Text>
          {(!disableSelfRemoval || userId !== val) && (
            <TbX size={14} strokeWidth={3} />
          )}
        </Group>
      </Paper>
    </UnstyledButton>
  ));

  const filteredUsers = useMemo(
    () =>
      filter(
        users,
        (user) =>
          includes(toLower(user.username), toLower(search)) &&
          !includes(userList, user.id),
      ) || [],
    [users, userList, search],
  );

  const slicedUsers = useMemo(
    () => slice(orderBy(filteredUsers, ['username'], ['asc']), 0, 6),
    [users, userList, search],
  );

  const options = useMemo(
    () =>
      map(slicedUsers, (user) => (
        <Combobox.Option
          value={user.id}
          key={user.id}
          active={includes(userList, user.id)}
        >
          <Group gap={isMobile ? 'xs' : 'sm'} wrap="nowrap">
            <Avatar size="sm" src={user.avatar_url} />
            <Text fz="sm" truncate maw={isMobile ? '30ch' : undefined}>
              {user.username}
            </Text>
          </Group>
        </Combobox.Option>
      )),
    [users, userList, search],
  );

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          label={
            <Group gap="xs" mb={isMobile ? 0 : 'xs'}>
              <Text fz="sm" fw="500">
                Co-organisers
              </Text>
              {!isMobile && (
                <Tooltip label="Switch from using inputs to drag and drop">
                  <ActionIcon
                    size="sm"
                    color="yellow"
                    variant="light"
                    onClick={() => setDragAndDrop(!dragAndDrop)}
                  >
                    <TbSwitch2 />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          }
          pointer
          onClick={() => combobox.openDropdown()}
          rightSection={loadingUsers && <Loader size="xs" />}
          style={{ flexGrow: 1 }}
        >
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                placeholder="Search users"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    if (
                      userList[userList.length - 1] === userId &&
                      disableSelfRemoval
                    )
                      return;
                    handleValueRemove(userList[userList.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>
      <Combobox.Dropdown>
        <Combobox.Options mah={250} style={{ overflowY: 'auto' }}>
          <ScrollArea>
            {slicedUsers.length ? (
              options
            ) : (
              <Group gap="xs" align="center" justify="center" py="sm">
                <TbX size={16} />
                <Text fz="sm" c="dimmed">
                  No users found
                </Text>
              </Group>
            )}
          </ScrollArea>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default UserListCombobox;
