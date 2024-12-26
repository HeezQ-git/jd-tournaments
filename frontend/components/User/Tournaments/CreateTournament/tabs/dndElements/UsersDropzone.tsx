import { useTournamentStore } from '@/stores/tournamentStore';
import { useUserStore } from '@/stores/userStore';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Avatar, CloseButton, Flex, Paper, Text, Tooltip } from '@mantine/core';
import { find, map, startsWith } from 'lodash';
import React, { useMemo } from 'react';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const TooltipWrapper = ({
  children,
  label,
  condition,
}: {
  children: React.ReactNode;
  label: string;
  condition: boolean;
}) =>
  condition ? (
    <Tooltip label={label} position="top" withArrow>
      {children}
    </Tooltip>
  ) : (
    children
  );

const UsersDropzone = ({
  name,
  disableSelfRemoval = true,
  text,
}: {
  name: string;
  disableSelfRemoval?: boolean;
  text?: string;
}) => {
  const { users } = useTournamentStore();
  const { userMetadata } = useUserStore();
  const creatorId = useMemo(
    () => find(users, (user) => user.username === userMetadata?.username)?.id,
    [users, userMetadata],
  );

  const form = useTournamentsFormContext();
  const userList = (form.values as any)[name] as string[];

  const removeUser = (userId?: string) => {
    form.setFieldValue(
      name,
      (form.values as any)[name].filter((id: string) => id !== userId),
    );
  };

  return (
    <Droppable droppableId={name} direction="horizontal">
      {(provided, snapshot) => (
        <Flex
          {...provided.droppableProps}
          ref={provided.innerRef}
          gap="sm"
          p="xs"
          w="100%"
          wrap="wrap"
          bg={
            startsWith(snapshot.draggingOverWith || '', 'user#')
              ? 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))'
              : 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))'
          }
          bd="1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))"
          mih="60"
        >
          {text && userList.length <= 0 && (
            <Text c="dimmed" fz="sm">
              {text}
            </Text>
          )}
          {userList.length > 0 &&
            map(userList, (userId, index) => {
              const user = find(users, { id: userId });

              return (
                <Draggable
                  key={`${name}#${userId}`}
                  draggableId={`${name}#${userId}`}
                  index={index}
                >
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      withBorder
                    >
                      <Flex align="center" gap="sm" p="xs">
                        <Avatar src={user?.avatar_url} size={26} />
                        <TooltipWrapper
                          label={user?.username || ''}
                          condition={(user?.username?.length ?? 0) > 15}
                        >
                          <Text fw="500" fz="sm" truncate maw="150">
                            {user?.username}
                            {creatorId === userId && ' (you)'}
                          </Text>
                        </TooltipWrapper>
                        {(!disableSelfRemoval || creatorId !== userId) && (
                          <CloseButton onClick={() => removeUser(user?.id)} />
                        )}
                      </Flex>
                    </Paper>
                  )}
                </Draggable>
              );
            })}
          {provided.placeholder}
        </Flex>
      )}
    </Droppable>
  );
};

export default UsersDropzone;
