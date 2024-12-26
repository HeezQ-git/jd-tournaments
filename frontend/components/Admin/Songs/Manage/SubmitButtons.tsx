import React, { useMemo } from 'react';
import { Button, Group } from '@mantine/core';
import { Song } from '@/types/song';
import { TbCheck, TbTrash } from 'react-icons/tb';

import { confirmDeleteImageModal } from './lib/confirmDeleteImageModal';
import { useSongFormContext } from './lib/formContext';

type SubmitButtonsProps = {
  action: 'add' | 'edit';
  t: TransFunction;
  song?: Song;
};

const SubmitButtons: React.FC<SubmitButtonsProps> = ({ action, t, song }) => {
  const form = useSongFormContext();

  return useMemo(
    () => (
      <Group justify="space-between" mt="sm">
        <Button
          color="red"
          leftSection={<TbTrash size={16} />}
          variant="subtle"
          disabled={!form.values.image_path}
          onClick={() =>
            action === 'edit'
              ? confirmDeleteImageModal({ t, songId: song?.id, form })
              : form.setFieldValue('image_path', '')
          }
        >
          {t('deleteImage.button')}
        </Button>
        <Button
          type="submit"
          color="green"
          leftSection={<TbCheck size={16} strokeWidth={3} />}
          variant="gradient"
          gradient={{ from: 'teal', to: 'cyan' }}
        >
          {t('song.save')}
        </Button>
      </Group>
    ),
    [action, form.values.image_path],
  );
};

export default SubmitButtons;
