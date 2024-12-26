import React, { forwardRef, useMemo, useCallback } from 'react';
import { PasswordInput } from '@mantine/core';
import { useAuthFormContext } from '../lib/authFormContext';
import { PasswordStrengthValues } from '../AuthenticationForm';

// eslint-disable-next-line react/display-name
const PasswordInputElement = forwardRef<
  HTMLInputElement,
  {
    t: TransFunction;
    type: 'login' | 'register';
    setPasswordStrengthValues: (_: any) => void;
  }
>(({ t, type, setPasswordStrengthValues }, ref) => {
  const form = useAuthFormContext();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const password = event.currentTarget.value;
      form.setFieldValue('password', password);

      if (type !== 'register') return;

      const passwordStrengthValues: PasswordStrengthValues = {
        minimum: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]/.test(password),
      };

      setPasswordStrengthValues(passwordStrengthValues);
    },
    [form, type, setPasswordStrengthValues],
  );

  return useMemo(
    () => (
      <PasswordInput
        required
        ref={ref}
        label={t('form.password')}
        placeholder={t('form.yourPassword')}
        {...form.getInputProps('password')}
        value={form.values.password}
        onChange={handleChange}
        error={t(`${form.errors.password ?? ''}`)}
        radius="md"
      />
    ),
    [form.values.password, form.errors.password, handleChange, t],
  );
});

export default PasswordInputElement;
