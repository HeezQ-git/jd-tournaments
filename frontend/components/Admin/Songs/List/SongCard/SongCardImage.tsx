'use client';

import { Box, Card, Flex } from '@mantine/core';
import Image from 'next/image';
import React, { useState } from 'react';
import supabaseLoader from '@/utils/supabase/imageLoader';
import { TbMusic } from 'react-icons/tb';
import styles from '../SongList.module.css';

const SongCardImage = ({
  imagePath,
  title,
  isCard = true,
  containerHeight,
  style,
  noteSize,
}: {
  imagePath: string | null;
  title: string;
  isCard?: boolean;
  containerHeight?: number;
  style?: React.CSSProperties;
  noteSize?: number;
}) => {
  const [imageError, setImageError] = useState(false);

  const Wrapper = isCard ? Card.Section : React.Fragment;

  return (
    <Wrapper>
      <Flex bg="light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-7))">
        {imagePath && !imageError ? (
          <Box
            className={styles.imageContainer}
            style={{
              height: containerHeight || 125,
              ...style,
            }}
          >
            <Image
              src={supabaseLoader({
                src: `song_images/${imagePath}`,
                width: 200,
                quality: 70,
              })}
              alt={title}
              width={
                (style?.width
                  ? ((style.width as number) || 0) + 25
                  : undefined) || 150
              }
              height={
                (style?.height
                  ? ((style.height as number) || 0) + 25
                  : undefined) || 100
              }
              className={styles.image}
              data-is-card={isCard}
              onError={() => setImageError(true)}
            />
          </Box>
        ) : (
          <Flex
            justify="center"
            align="center"
            className={styles.imageContainer}
            style={{
              height: containerHeight || 125,
              ...style,
            }}
          >
            <TbMusic
              size={noteSize ?? 50}
              color="light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-1))"
            />
          </Flex>
        )}
      </Flex>
    </Wrapper>
  );
};

export default SongCardImage;
