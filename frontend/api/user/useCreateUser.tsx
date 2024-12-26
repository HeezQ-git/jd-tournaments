import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateUserData, UserResponse } from '@/types/user';
import { usersEndpoints } from '@/app/api/endpoints';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { FaExclamationCircle } from 'react-icons/fa';

import { createUser } from './user';

export const useCreateUser = (t: TransFunction) => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, AxiosError, CreateUserData>({
    mutationKey: [usersEndpoints.create.key],
    mutationFn: (newUser: CreateUserData) => createUser(newUser),
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({
        queryKey: [usersEndpoints.getAll.key],
      });
      const previousUsers = queryClient.getQueryData<UserResponse[]>([
        usersEndpoints.getAll.key,
      ]);

      queryClient.setQueryData<UserResponse[]>(
        [usersEndpoints.getAll.key],
        (oldUsers: any) => [
          ...oldUsers,
          {
            id: (oldUsers?.length || 0) + 1,
            ...newUser,
          },
        ],
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
