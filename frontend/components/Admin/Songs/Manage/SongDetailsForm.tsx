import React, { useMemo } from 'react';
import {
  Box,
  Checkbox,
  Flex,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core';
import { Difficulty, Effort, Mode } from '@/types/song';
import { useMediaQuery } from '@mantine/hooks';
import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';
import { values } from 'lodash';

import MultiSelect from './components/MultiSelect';
import CreatableSelect from './components/CreatableSelect';
import { useSongFormContext } from './lib/formContext';
import { SelectElement } from './components/SelectElement';

type MiscData = {
  tags?: string[];
  artists?: string[];
  game?: string[];
  version?: string[];
  exclusivity?: string[];
};

type SongDetailsFormProps = {
  miscData?: MiscData;
  loading: boolean;
  t: TransFunction;
};

const SongDetailsForm: React.FC<SongDetailsFormProps> = ({
  miscData,
  loading,
  t,
}) => {
  const form = useSongFormContext();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);

  const {
    tags,
    artists,
    game: games,
    version: versions,
    exclusivity: exclusivities,
  } = miscData || {};

  const TitleInput = useMemo(
    () => (
      <TextInput
        label={t('song.title')}
        {...form.getInputProps('title')}
        error={t(`${form.errors?.title ?? ''}`)}
      />
    ),
    [form.values.title, form.errors.title],
  );

  const ArtistsSelect = useMemo(
    () => (
      <Box mt="xs">
        <MultiSelect
          data={artists}
          loading={loading}
          name="artists"
          label={t('song.artists')}
          form={form}
          t={t}
        />
      </Box>
    ),
    [artists, loading, form.values.artists, form.errors.artists],
  );

  const GameSelect = useMemo(
    () => (
      <CreatableSelect
        name="game"
        data={games}
        loading={loading}
        label={t('song.game')}
        disallowClear
        t={t}
      />
    ),
    [games, loading],
  );

  const ExclusivitySelect = useMemo(
    () => (
      <CreatableSelect
        data={exclusivities}
        loading={loading}
        label={t('song.exclusivity')}
        name="exclusivity"
        t={t}
      />
    ),
    [exclusivities, loading, form.values.exclusivity],
  );

  const VersionSelect = useMemo(
    () => (
      <CreatableSelect
        data={versions}
        loading={loading}
        label={t('song.version')}
        name="version"
        t={t}
      />
    ),
    [versions, loading, form.values.version],
  );

  const ReleaseYearInput = useMemo(
    () => (
      <NumberInput
        label={t('song.releaseYear')}
        {...form.getInputProps('release_year')}
        error={t(`${form.errors?.release_year ?? ''}`)}
      />
    ),
    [form.values.release_year, form.errors.release_year],
  );

  const SelectElements = useMemo(
    () => (
      <SimpleGrid w="100%" cols={3}>
        <SelectElement data={values(Mode)} name="mode" t={t} />
        <SelectElement data={values(Difficulty)} name="difficulty" t={t} />
        <SelectElement data={values(Effort)} name="effort" t={t} />
      </SimpleGrid>
    ),
    [form.values.mode, form.values.difficulty, form.values.effort],
  );

  const TagsSelect = useMemo(
    () => (
      <MultiSelect
        data={tags}
        name="tags"
        label={t('song.tags')}
        form={form}
        t={t}
      />
    ),
    [tags, loading, form.values.tags],
  );

  const Checkboxes = useMemo(
    () => (
      <Flex gap="xl" w="100%" wrap="wrap" mt="md">
        <Checkbox
          {...form.getInputProps('jdplus_required', { type: 'checkbox' })}
          label={t('song.jdpRequired')}
          fw="500"
        />
        <Checkbox
          {...form.getInputProps('camera_supported', { type: 'checkbox' })}
          label={t('song.cameraSupport')}
          fw="500"
        />
      </Flex>
    ),
    [form.values.jdplus_required, form.values.camera_supported],
  );

  return (
    <Stack gap="sm">
      {TitleInput}
      {ArtistsSelect}
      {ReleaseYearInput}
      {SelectElements}
      {GameSelect}
      <Group
        w="100%"
        gap={isMobile ? 'xs' : 'md'}
        wrap={isMobile ? 'wrap' : 'nowrap'}
      >
        {ExclusivitySelect}
        {VersionSelect}
      </Group>
      {TagsSelect}
      {Checkboxes}
    </Stack>
  );
};

export default SongDetailsForm;
