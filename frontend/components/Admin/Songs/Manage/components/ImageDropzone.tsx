/* eslint-disable no-unused-vars */
import React, { useCallback, useMemo } from 'react';
import { Box, Group, rem, Stack, Text } from '@mantine/core';
import { Dropzone, FileRejection, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Image from 'next/image';
import { notifications } from '@mantine/notifications';
import supabaseLoader from '@/utils/supabase/imageLoader';
import { isString, startsWith } from 'lodash';
import { TbPhoto, TbUpload, TbX } from 'react-icons/tb';

import { useSongFormContext } from '../lib/formContext';

interface ImageDropzoneProps {
  t: TransFunction;
}

type OnDropHandler = (files: File[]) => void;
type OnRejectHandler = (files: FileRejection[]) => void;

const isFile = (value: any): value is File => value instanceof File;

// eslint-disable-next-line react/display-name
const ImageDropzone: React.FC<ImageDropzoneProps> = React.memo(({ t }) => {
  const form = useSongFormContext();

  const imageURL = useMemo(() => {
    if (isString(form.values.image_path)) return form.values.image_path;

    if (form.values.image_path && isFile(form.values.image_path)) {
      return URL.createObjectURL(form.values.image_path);
    }

    return '';
  }, [form.values.image_path]);

  const handleDrop = useCallback<OnDropHandler>(
    (files) => {
      if (files && files.length > 0) {
        form.setFieldValue('image_path', files[0] as unknown as string);
      }
    },
    [form],
  );

  const handleReject = useCallback<OnRejectHandler>((files) => {
    if (files && files.length > 0) {
      const error = files[0].errors[0];
      if (error.code === 'file-too-large') {
        notifications.show({
          message: t('dropzone.errors.fileSize'),
          color: 'red',
        });
      } else {
        notifications.show({
          message: t('dropzone.errors.fileType'),
          color: 'red',
        });
      }
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    if (isFile(form.values.image_path)) URL.revokeObjectURL(imageURL);
  }, [form.values.image_path, imageURL]);

  return useMemo(
    () => (
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={2 * 1024 ** 2} // 2 MB
        accept={IMAGE_MIME_TYPE}
        mt="md"
        key={form.key('image_path')}
        {...form.getInputProps('image_path')}
      >
        <Group
          justify="center"
          gap="lg"
          mih={rem(150)}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <TbUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-teal-6)',
              }}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <TbX
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-red-6)',
              }}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <TbPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-dimmed)',
              }}
            />
          </Dropzone.Idle>

          <Box>
            <Text size="xl" ta="center" inline>
              {t('dropzone.instructions')}
            </Text>
            <Text size="sm" c="dimmed" ta="center" inline mt={7}>
              {t('dropzone.maxSize')}
            </Text>
          </Box>
        </Group>
        <Stack gap="4" w="100%" mt="xs" align="center" justify="center">
          {imageURL && (
            <>
              <Image
                src={
                  !startsWith(imageURL, 'blob:')
                    ? supabaseLoader({
                        src: `song_images/${imageURL}`,
                        width: 150,
                        quality: 0,
                      })
                    : imageURL
                }
                alt="Image preview"
                width={200}
                height={200}
                priority
                style={{
                  width: 'max-content',
                  height: 'max-content',
                  maxWidth: '50%',
                  objectFit: 'contain',
                }}
                onLoad={handleImageLoad}
              />
              {isFile(form.values.image_path) ? (
                <Text fz="xs" c="dimmed" w="max-content" ta="center">
                  {form.values.image_path?.name} (
                  {Math.round(form.values.image_path.size / 1024)}
                  kb)
                </Text>
              ) : (
                <Text fz="xs" c="dimmed" ta="center">
                  {t('dropzone.currentlyUploaded')}
                </Text>
              )}
            </>
          )}
        </Stack>
      </Dropzone>
    ),
    [form, handleDrop, handleReject, handleImageLoad, imageURL, t],
  );
});

export default ImageDropzone;
