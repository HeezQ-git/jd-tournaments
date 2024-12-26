import { Divider, TextInput } from '@mantine/core';
import React, { useCallback } from 'react';
import { useAuthFormContext } from '../lib/authFormContext';

const UsernameInput = React.memo(
  ({ t, shouldShow }: { t: TransFunction; shouldShow: boolean }) => {
    const form = useAuthFormContext();

    interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

    const handleChange = useCallback(
      (event: HandleChangeEvent) => {
        form.setFieldValue('username', event.currentTarget.value);
      },
      [form],
    );

    if (!shouldShow) return null;

    return (
      <>
        <Divider label={t('continueWithEmail')} mt="sm" />
        <TextInput
          required
          label={t('form.username')}
          placeholder={t('form.yourUsername')}
          value={form.values.username}
          onChange={handleChange}
          error={t(`${form.errors.username ?? ''}`)}
          radius="md"
        />
      </>
    );
  },
);

UsernameInput.displayName = 'UsernameInput';

export default UsernameInput;
