import { fetchAPI } from '@/app/api/apiFunctions';
import {
  songsEndpoints,
  tournamentsEndpoints,
  usersEndpoints,
} from '@/app/api/endpoints';
import { notifications } from '@mantine/notifications';
import { TbCheck, TbWorldCheck } from 'react-icons/tb';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import ROUTES from '@/utils/routes';
import { getQueryClient } from '@/utils/getQueryClient';
import dayjs from 'dayjs';
import { map, reduce } from 'lodash';
import { Song } from '@/types/song';
import { useTournamentsFormContext } from '../tournamentsFormContext';

export const handleSaveChanges = async (
  form: ReturnType<typeof useTournamentsFormContext>,
  router: AppRouterInstance,
) => {
  const { id, creatorId } = form.values;

  const { values } = form;

  if (values.timeLimitedBy === 'endDate') {
    values.duration = dayjs(values.endDate).diff(values.startDate, 'seconds');

    if (values.duration < 0) {
      values.duration = 0;
      return notifications.show({
        title: 'Error',
        message: 'End date should be after start date',
        color: 'red',
      });
    }
  } else if (values.timeLimitedBy === 'songs') {
    const allSongs = await fetchAPI<Song[]>(songsEndpoints.getAll);
    const songs = map(values.songs, (songId) =>
      allSongs.find((s) => s.id === songId),
    );

    const duration = reduce(
      songs,
      (acc, song) => acc + (song?.duration || 0),
      0,
    );

    values.duration = duration;
  } else if (values.timeLimitedBy !== 'duration') {
    values.duration = values.duration || 0;

    notifications.show({
      title: 'Error',
      message: 'Invalid time limit',
      color: 'red',
    });
  }

  if (!creatorId) {
    return notifications.show({
      title: 'Error',
      message: `We couldn't find your user ID. Maybe you're not logged in or your session expired.`,
      color: 'red',
    });
  }

  const dataToSend = {
    ...form.values,
    endDate: undefined,
  };

  if (!id) {
    const { id: createdId } = await fetchAPI(tournamentsEndpoints.create, {
      data: dataToSend,
    });

    form.setFieldValue('id', createdId);
    router.push(`${ROUTES.USER.TOURNAMENT.CREATE}/${createdId}`);

    getQueryClient().invalidateQueries({
      queryKey: [usersEndpoints.getTournaments.key],
    });

    return notifications.show({
      title: 'Success',
      message: 'Saved the tournament as a draft',
      icon: <TbCheck />,
      color: 'teal',
    });
  }

  const { status } = await fetchAPI(tournamentsEndpoints.save, {
    data: dataToSend,
    fetcherOptions: { wholeResponse: true },
  });

  if (status === 200) {
    getQueryClient().invalidateQueries({
      queryKey: [usersEndpoints.getTournaments.key],
    });
    getQueryClient().invalidateQueries({
      queryKey: [tournamentsEndpoints.getById.key],
    });

    notifications.show({
      title: 'Success',
      message: 'Changes saved successfully',
      icon: <TbCheck />,
      color: 'teal',
    });

    return true;
  }

  return false;
};

export const handlePublishTournament = async (
  form: ReturnType<typeof useTournamentsFormContext>,
) => {
  const data = {
    ...form.values,
    isPublished: !form.values.isPublished,
    endDate: undefined,
  };

  const { status } = await fetchAPI(tournamentsEndpoints.setPublish, {
    data: { id: form.values.id, isPublished: !form.values.isPublished },
    fetcherOptions: { wholeResponse: true },
  });

  if (status === 200) {
    getQueryClient().invalidateQueries({
      queryKey: [usersEndpoints.getTournaments.key],
    });
    getQueryClient().invalidateQueries({
      queryKey: [tournamentsEndpoints.getById.key],
    });

    notifications.show({
      title: 'Success',
      message: `Tournament ${
        form.values.isPublished ? 'unpublished' : 'published'
      } successfully`,
      icon: <TbWorldCheck />,
      color: 'teal',
    });

    form.setFieldValue('isPublished', !form.values.isPublished);

    return true;
  }

  return false;
};
