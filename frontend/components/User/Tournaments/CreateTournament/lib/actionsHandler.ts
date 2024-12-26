import { fetchAPI } from '@/app/api/apiFunctions';
import { tournamentsEndpoints } from '@/app/api/endpoints';
import { notifications } from '@mantine/notifications';
import { useTournamentsFormContext } from '../tournamentsFormContext';

export const handleSaveChanges = async (
  form: ReturnType<typeof useTournamentsFormContext>,
) => {
  const { id } = form.values;

  if (!id) {
    const { id: createdId } = await fetchAPI(tournamentsEndpoints.create, {
      data: form.values,
    });

    form.setFieldValue('id', createdId);
    return notifications.show({
      title: 'Success',
      message: 'Saved tournament draft changes',
      color: 'teal',
    });
  }

  await fetchAPI(tournamentsEndpoints.save, {
    data: form.values,
  });
};
