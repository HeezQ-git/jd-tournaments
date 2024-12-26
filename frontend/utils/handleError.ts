import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';

export const handleError = (error: AxiosError) => {
  if (error.request) {
    notifications.show({
      title: 'Error',
      message: 'No response from server. Please try again later.',
      color: 'red',
    });
  } else {
    notifications.show({
      title: 'Error',
      message: error.message || 'An unexpected error occurred',
      color: 'red',
    });
  }
};
