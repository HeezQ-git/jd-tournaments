/* eslint-disable import/prefer-default-export */
import { Song } from '@/types/song';
import {
  forEach,
  isArray,
  isEqual,
  startsWith,
  toPairs,
  toString,
} from 'lodash';
import { formatToPostgresArray } from '@/utils/utils';
import ROUTES from '@/utils/routes';
import { notifications } from '@mantine/notifications';
import { songsEndpoints } from '@/app/api/endpoints';
import { getQueryClient } from '@/utils/getQueryClient';
import { fetchAPI } from '@/app/api/apiFunctions';

function areValuesEqual(a: any, b: any): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    return isEqual(a, b);
  }
  const isEmptyA = a === null || a === undefined || a === '';
  const isEmptyB = b === null || b === undefined || b === '';
  if (isEmptyA && isEmptyB) {
    return true;
  }
  return a === b;
}

export const onManageSongSubmit =
  (
    action: 'add' | 'edit',
    router: any,
    t: TransFunction,
    song?: Song,
    id?: string,
    getSongData?: () => any,
  ) =>
  async (values: any, e: any) => {
    e.preventDefault();

    const songFormData = new FormData();

    forEach(toPairs(values), ([key, value]) => {
      if (key === 'image_path' || value === undefined) return;

      let newValue = value;
      if (isArray(value)) newValue = formatToPostgresArray(value);
      else newValue = toString(value);

      songFormData.append(key, newValue as string);
    });

    let createdSongId: string | undefined;
    let changesMade = true;

    if (action === 'add') {
      try {
        const response = await fetchAPI<any>(songsEndpoints.create, {
          data: songFormData,
          fetcherOptions: { wholeResponse: true },
        });

        if (response.status === 201) {
          notifications.show({
            message: t('form.createSuccess'),
            color: 'teal',
          });
          createdSongId = response.data.id;
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message:
            (error as any)?.response?.data?.error || t('form.createFailed'),
          color: 'red',
        });
        return false;
      }
    } else if (action === 'edit') {
      if (!song) {
        notifications.show({
          message: t('form.noData'),
          color: 'red',
        });
        return false;
      }

      // Check if any changes were made
      const hasChanges = Object.entries(values).some(([key, value]) => {
        if (key === 'image_path') return false;
        return !areValuesEqual(song[key as keyof Song], value);
      });

      if (!hasChanges) {
        if (!(values.image_path instanceof File))
          notifications.show({ message: t('form.noChanges'), color: 'red' });
        changesMade = false;
      }

      if (changesMade) {
        const notifId = notifications.show({
          title: t('form.updating'),
          message: t('form.wait'),
          autoClose: false,
          withCloseButton: false,
          loading: true,
        });

        try {
          const response = await fetchAPI<any>(songsEndpoints.edit, {
            slugs: { id },
            data: songFormData,
            fetcherOptions: { wholeResponse: true },
          });

          if (response.status === 200) {
            notifications.update({
              id: notifId,
              title: t('common:success'),
              message: t('form.updateSuccess'),
              color: 'teal',
              loading: false,
              autoClose: 3000,
            });
          }
        } catch (error) {
          notifications.update({
            id: notifId,
            title: 'Error',
            message:
              (error as any)?.response?.data?.error || t('form.updateFailed'),
            color: 'red',
            loading: false,
            autoClose: 3000,
          });
          return false;
        }
      }
    }

    // Handle image upload if a new image is provided
    if (values.image_path instanceof File) {
      const imageFormData = new FormData();
      imageFormData.append('image_path', values.image_path);

      const notifId = notifications.show({
        title: t('form.uploadingImage'),
        message: t('form.wait'),
        autoClose: false,
        withCloseButton: false,
        loading: true,
      });

      try {
        const response = await fetchAPI<any>(songsEndpoints.addImage, {
          slugs: { id: createdSongId || id },
          data: imageFormData,
          fetcherOptions: { wholeResponse: true, isBlob: true },
        });

        if (response.status === 200) {
          notifications.update({
            id: notifId,
            title: t('common:success'),
            message: t('form.imageUploadSuccess'),
            color: 'teal',
            loading: false,
            autoClose: 3000,
          });
        }
      } catch (error) {
        notifications.update({
          id: notifId,
          title: 'Error',
          message:
            (error as any)?.response?.data?.error ||
            t('form.imageUploadFailed'),
          color: 'red',
          loading: false,
          autoClose: 3000,
        });
        return false;
      }
    }

    // Redirect if changes were made
    if (changesMade) {
      await getQueryClient().invalidateQueries({
        queryKey: [songsEndpoints.getDistinctData.key],
      });
      await getQueryClient().invalidateQueries({
        queryKey: [songsEndpoints.getAll.key],
      });
      await getSongData?.();
      router.push(ROUTES.ADMIN.HOME);
    }
  };
