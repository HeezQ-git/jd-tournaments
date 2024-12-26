import { Select } from '@mantine/core';
import React, { useMemo } from 'react';
import { FormValues, useSongFormContext } from '../lib/formContext';

export const SelectElement: React.FC<{
  t: any;
  name: string;
  data: string[];
}> = ({ t, name, data }) => {
  const form = useSongFormContext();

  return useMemo(
    () => (
      <Select
        data={data}
        label={t(`song.${name}`)}
        allowDeselect={false}
        {...form.getInputProps(name)}
        error={form.errors?.[name] && t('validation.provide')}
      />
    ),
    [t, form.values[name as keyof FormValues], name, data],
  );
};
