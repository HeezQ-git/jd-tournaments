import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateUserData, User } from '@/types/user';
import { usersEndpoints } from '@/app/api/endpoints';
import { notifications } from '@mantine/notifications';
import { FaExclamationCircle } from 'react-icons/fa';
import { AxiosError } from 'axios';

import { editUser } from './user';

export const useEditUser = (t: TransFunction) => {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, UpdateUserData>({
    mutationKey: [usersEndpoints.edit.key],
    mutationFn: (newData: UpdateUserData) => editUser(newData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: [usersEndpoints.getAll.key],
      });

      const previousUsers = queryClient.getQueryData<User[]>([
        usersEndpoints.getAll.key,
      ]);

      queryClient.setQueryData<User[]>(
        [usersEndpoints.getAll.key],
        (oldUsers: any) => {
          const index = oldUsers?.findIndex(
            (user: User) => user.id === newData.id,
          );
          if (index !== -1) {
            const oldUser = oldUsers[index];
            const newUsers = oldUsers.filter(
              (user: User) => user.id !== newData.id,
            );
            return [...newUsers, { ...oldUser, ...newData }];
          }
          return [...oldUsers];
        },
      );

      return { previousUsers };
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [usersEndpoints.getAll.key],
        });
      }, 100);
    },
    onError: (error: AxiosError, _, context: any) => {
      queryClient.setQueryData(
        [usersEndpoints.getAll.key],
        context?.previousUsers,
      );
      notifications.show({
        title: t('common:error'),
        message: t((error?.response?.data as any)?.error || error.message),
        color: 'red',
        icon: <FaExclamationCircle />,
      });
    },
  });
};
