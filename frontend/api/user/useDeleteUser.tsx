import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersEndpoints } from '@/app/api/endpoints';
import { notifications } from '@mantine/notifications';
import { FaExclamationCircle } from 'react-icons/fa';
import { AxiosError } from 'axios';

import { deleteUser } from './user';

export const useDeleteUser = (t: TransFunction) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [usersEndpoints.getAll.key] });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: t('common:error'),
        message: t((error?.response?.data as any)?.error || error.message),
        color: 'red',
        icon: <FaExclamationCircle />,
      });
    },
  });
};
