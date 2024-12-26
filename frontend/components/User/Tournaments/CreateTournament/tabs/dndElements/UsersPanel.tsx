import { useUserStore } from '@/stores/userStore';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  ActionIcon,
  Avatar,
  Flex,
  Group,
  Loader,
  Paper,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import React, { useMemo } from 'react';
import { TbSearch, TbSwitch2, TbX } from 'react-icons/tb';
import { useTournamentStore } from '@/stores/tournamentStore';
import { filter, find, includes, map, orderBy, slice, toLower } from 'lodash';
import { useDebouncedState } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';

const UserTile = ({ provided, snapshot, user, userId }: any) => (
  <Paper
    ref={provided?.innerRef}
    {...provided?.draggableProps}
    {...provided?.dragHandleProps}
    style={{
      ...provided?.draggableProps.style,
      cursor: 'grab',
    }}
    shadow="xs"
    withBorder
    bg={
      !snapshot?.isDragging
        ? 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))'
        : undefined
    }
    w={!snapshot?.isDragging ? '100%' : 'max-content'}
  >
    <Flex align="center" gap="sm" p="xs">
      <Avatar src={user.avatar_url} size={26} />
      <Text fw="500" fz="sm" truncate>
        {user.username}
        {userId === user.id && ' (you)'}
      </Text>
    </Flex>
  </Paper>
);

const UsersPanel = ({ shouldShow }: { shouldShow: boolean }) => {
  const [search, setSearch] = useDebouncedState('', 250);

  const { users, loadingUsers, dragAndDrop, setDragAndDrop } =
    useTournamentStore();

  const { userMetadata } = useUserStore();
  const userId = useMemo(
    () => find(users, (user) => user.username === userMetadata?.username)?.id,
    [users, userMetadata],
  );

  const slicedUsers = useMemo(() => {
    const filteredUsers =
      filter(users, (user) =>
        includes(toLower(user.username), toLower(search)),
      ) || [];

    return slice(orderBy(filteredUsers, ['username'], ['asc']), 0, 6);
  }, [users, search]);

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {shouldShow && dragAndDrop && (
        <Flex w="clamp(200px, 100%, 270px)" h="max-content" visibleFrom="sm">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{
              type: 'spring',
              duration: 0.25,
            }}
            style={{ width: '100%', willChange: 'contents' }}
          >
            <Paper w="100%" shadow="lg" p="md" withBorder>
              <Group
                gap="xs"
                justify="center"
                align="center"
                w="100%"
                h="max-content"
                mb="md"
                wrap="nowrap"
              >
                <TextInput
                  size="sm"
                  placeholder="Search users"
                  leftSection={<TbSearch />}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  style={{ flexGrow: 1 }}
                />
                <Tooltip label="Switch from using drag and drop to inputs">
                  <ActionIcon
                    color="yellow"
                    variant="light"
                    onClick={() => setDragAndDrop(!dragAndDrop)}
                  >
                    <TbSwitch2 />
                  </ActionIcon>
                </Tooltip>
              </Group>
              <Droppable
                droppableId="users"
                direction="vertical"
                isDropDisabled
              >
                {(provided) => (
                  <Flex
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    direction="column"
                    align="center"
                    gap="md"
                  >
                    {!slicedUsers.length && !loadingUsers && (
                      <Group gap="xs" align="center" justify="center" py="sm">
                        <TbX size={16} color="var(--mantine-color-dimmed)" />
                        <Text fz="sm" c="dimmed">
                          No users found
                        </Text>
                      </Group>
                    )}
                    {loadingUsers ? (
                      <Loader size="sm" />
                    ) : (
                      map(slicedUsers, (user, index) => (
                        <Draggable
                          key={`user#${user.id}`}
                          draggableId={`user#${user.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <>
                              <UserTile
                                provided={provided}
                                snapshot={snapshot}
                                user={user}
                                userId={userId}
                              />
                              {snapshot.isDragging && (
                                <UserTile user={user} userId={userId} />
                              )}
                            </>
                          )}
                        </Draggable>
                      ))
                    )}
                  </Flex>
                )}
              </Droppable>
            </Paper>
          </motion.div>
        </Flex>
      )}
    </AnimatePresence>
  );
};

export default UsersPanel;
