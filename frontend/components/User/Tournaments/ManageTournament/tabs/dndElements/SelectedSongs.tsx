import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ActionIcon, Badge, Flex, Group, Paper } from '@mantine/core';
import { filter, find, map } from 'lodash';
import SongCardImage from '@/components/Admin/Songs/List/SongCard/SongCardImage';
import { TbX } from 'react-icons/tb';
import { Song } from '@/types/song';
import { AnimatePresence } from 'framer-motion';
import { SongTitleAndArtists } from '../SongsTab/SongCard';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import AnimatedItem from '../AnimatedItem';

const SelectedSongs = ({ songs }: { songs?: Song[] }) => {
  const form = useTournamentsFormContext();
  const { songs: selectedSongs } = form.values;

  return (
    <Droppable droppableId="songs">
      {(provided) => (
        <Flex
          direction="column"
          gap="sm"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <AnimatePresence presenceAffectsLayout>
            {map(selectedSongs, (songId, index) => {
              const song = find(songs, (song) => song.id === songId);

              return (
                <Draggable draggableId={songId} index={index} key={songId}>
                  {(provided, snapshot) => (
                    <AnimatedItem
                      delay={0}
                      key={songId}
                      animation="popIn"
                      duration={0.075}
                    >
                      <Group
                        gap="0"
                        w={snapshot.isDragging ? undefined : '100%'}
                        wrap="nowrap"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          cursor: 'grab',
                        }}
                      >
                        <Flex justify="center" w={50}>
                          <Badge radius="xl" size="sm">
                            {index + 1}
                          </Badge>
                        </Flex>
                        <Paper p="sm" shadow="sm" withBorder w="100%">
                          <Flex align="center" justify="space-between">
                            <Flex
                              align="center"
                              gap="sm"
                              maw={{
                                base: '22ch',
                                xs: '30ch',
                                sm: '40ch',
                                md: 'unset',
                              }}
                            >
                              <SongCardImage
                                imagePath={song?.image_path ?? ''}
                                title={song?.title ?? ''}
                                isCard={false}
                                noteSize={30}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 'var(--mantine-radius-xs)',
                                }}
                              />
                              <SongTitleAndArtists song={song ?? ({} as any)} />
                            </Flex>
                            <ActionIcon
                              size="sm"
                              color="red"
                              variant="light"
                              onClick={() =>
                                form.setFieldValue(
                                  'songs',
                                  filter(selectedSongs, (id) => id !== songId),
                                )
                              }
                            >
                              <TbX strokeWidth={3} />
                            </ActionIcon>
                          </Flex>
                        </Paper>
                      </Group>
                    </AnimatedItem>
                  )}
                </Draggable>
              );
            })}
          </AnimatePresence>
          {provided.placeholder}
        </Flex>
      )}
    </Droppable>
  );
};

export default SelectedSongs;
