import { Checkbox, Flex, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core';
import React from 'react';
import { TbArrowDown, TbArrowRight, TbQuestionMark } from 'react-icons/tb';
import { AnimatePresence } from 'framer-motion';
import { map } from 'lodash';
import useDeepMemo from '@/hooks/useDeepMemo';
import CheckboxCard from '../CheckboxCard';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import AnimatedItem from '../AnimatedItem';

const SongSelection = ({ isRandomBS }: { isRandomBS: boolean }) => {
  const form = useTournamentsFormContext();
  const {
    songSelection,
    maxSongs,
    songs: selectedSongs,
    fillGapMode,
  } = form.values;

  const RandomTypeCards = useDeepMemo(
    () => (
      <AnimatedItem key="songSelection">
        <Stack>
          <Flex justify="center">
            <TbArrowDown />
          </Flex>
          <Flex
            gap={{ base: 'xs', sm: 'md' }}
            direction={{ base: 'column', sm: 'row' }}
          >
            {map(['now', 'beforeStart', 'during'], (type, index) => (
              <AnimatedItem key={type} duration={0.1} delay={index * 0.1}>
                <CheckboxCard
                  cardValue={type}
                  name="randomType"
                  disallowDeselect
                  compact
                />
              </AnimatedItem>
            ))}
          </Flex>
        </Stack>
      </AnimatedItem>
    ),
    [],
  );

  const FillGapCheckbox = useDeepMemo(
    () => (
      <AnimatedItem animation="fadeIn" duration={0.15}>
        <Flex direction="column" gap="2px" mt="sm">
          <Checkbox
            label={
              <Flex gap="xs" align="center">
                <Text fz="sm" span>
                  I want to pre-select some songs (max. {(maxSongs ?? 0) - 1})
                </Text>
                <Tooltip
                  maw={350}
                  multiline
                  openDelay={200}
                  // eslint-disable-next-line max-len
                  label="This allows you to pre-select some songs before the tournament starts. The remaining amount of songs will be selected randomly. For example if you set the max songs to 5, then pre-select 3 songs, the remaining 2 songs will be selected randomly."
                >
                  <ThemeIcon
                    size="xs"
                    radius="xl"
                    variant="outline"
                    color="gray"
                  >
                    <TbQuestionMark strokeWidth={3} />
                  </ThemeIcon>
                </Tooltip>
              </Flex>
            }
            {...form.getInputProps('fillGapMode', {
              type: 'checkbox',
            })}
            checked={fillGapMode ?? false}
            onChange={(e) => {
              form.setFieldValue('fillGapMode', e.target.checked);
            }}
          />
          <Text c="dimmed" fz="xs" style={{ userSelect: 'none' }} span>
            <Flex align="center" gap="xs">
              <TbArrowRight />
              <Text inherit span>
                At least one song must be selected randomly
              </Text>
            </Flex>
          </Text>
        </Flex>
      </AnimatedItem>
    ),
    [fillGapMode, maxSongs],
  );

  return (
    <Flex direction="column" gap="md">
      <Flex
        gap={{ base: 'xs', sm: 'md' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <CheckboxCard
          cardValue="manual"
          name="songSelection"
          disallowDeselect
        />
        <CheckboxCard
          cardValue="random"
          name="songSelection"
          disallowDeselect
          onClick={() => {
            if (!form.values.randomType) {
              form.setFieldValue('randomType', 'now');
            }
            if (!maxSongs)
              form.setFieldValue('maxSongs', selectedSongs.length || 3);
          }}
        />
      </Flex>
      <AnimatePresence>
        {songSelection === 'random' && RandomTypeCards}
        {isRandomBS && (maxSongs ?? 0) - 1 > 0 && FillGapCheckbox}
      </AnimatePresence>
    </Flex>
  );
};

export default SongSelection;
