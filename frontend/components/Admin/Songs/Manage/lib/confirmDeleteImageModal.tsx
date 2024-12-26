import { fetchAPI } from '@/app/api/apiFunctions';
import { songsEndpoints } from '@/app/api/endpoints';

import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export const confirmDeleteImageModal = ({
  t,
  songId,
  form,
}: {
  t: TransFunction;
  songId?: string;
  form: any;
}) =>
  modals.openConfirmModal({
    title: t('deleteImage.title'),
    children: t('deleteImage.message'),
    labels: {
      confirm: t('deleteImage.delete'),
      cancel: t('deleteImage.cancel'),
    },
    confirmProps: { color: 'red' },
    centered: true,
    onConfirm: async () => {
      const notifId = notifications.show({
        title: t('deleteImage.deleting'),
        message: t('deleteImage.wait'),
        autoClose: false,
        withCloseButton: false,
        loading: true,
      });

      const response = await fetchAPI(songsEndpoints.deleteImage, {
        slugs: { id: songId },
        fetcherOptions: {
          wholeResponse: true,
          dependencies: { slugs: ['id'] },
        },
      });

      if (response.status === 200) {
        form.setFieldValue('image_path', '');
        notifications.update({
          id: notifId,
          title: t('deleteImage.success'),
          message: t('deleteImage.successMsg'),
          color: 'teal',
          loading: false,
          autoClose: 3000,
        });
      } else {
        notifications.update({
          id: notifId,
          title: t('deleteImage.error'),
          message: t('deleteImage.errorMsg'),
          color: 'red',
          loading: false,
          autoClose: 3000,
        });
      }
    },
  });
