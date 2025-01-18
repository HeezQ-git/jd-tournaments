import { NumberInput } from '@mantine/core';
import React from 'react';
import { Song } from '@/types/song';
import { isNumber } from 'lodash';
import useDeepMemo from '@/hooks/useDeepMemo';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const MaxSongsInput = ({ songs }: { songs?: Song[] }) => {
  const form = useTournamentsFormContext();
  const { songSelection } = form.values;

  return useDeepMemo(
    () => (
      <NumberInput
        label="Max songs in the tournament"
        placeholder={`Leave empty for no limit (1 - ${songs?.length})`}
        required={songSelection === 'random'}
        min={1}
        max={songs?.length}
        {...form.getInputProps('maxSongs')}
        onChange={(value) => {
          let newValue: number | undefined = Number(value);
          if (!isNumber(value) || Number.isNaN(newValue)) newValue = undefined;
          form.setFieldValue('maxSongs', newValue);
        }}
      />
    ),
    [songSelection, songs],
  );
};

export default MaxSongsInput;
