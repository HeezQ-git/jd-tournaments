import { TextInput } from '@mantine/core';
import React, { useCallback } from 'react';
import { useAuthFormContext } from '../lib/authFormContext';

const EmailInput = React.memo(
  ({ isTypeLogin, t }: { isTypeLogin: boolean; t: TransFunction }) => {
    const form = useAuthFormContext();

    interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

    const handleChange = useCallback(
      (event: HandleChangeEvent) => {
        form.setFieldValue('email', event.currentTarget.value);
      },
      [form],
    );

    return (
      <TextInput
        required
        label={isTypeLogin ? t('form.usernameOrEmail') : t('form.email')}
        placeholder={
          isTypeLogin ? t('form.yourUsernameOrEmail') : t('form.yourEmail')
        }
        value={form.values.email}
        onChange={handleChange}
        error={t(`${form.errors.email ?? ''}`)}
        radius="md"
      />
    );
  },
);

EmailInput.displayName = 'EmailInput';

export default EmailInput;
