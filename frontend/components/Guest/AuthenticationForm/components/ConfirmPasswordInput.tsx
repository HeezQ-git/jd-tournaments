import { Collapse, PasswordInput } from '@mantine/core';
import React from 'react';
import { useAuthFormContext } from '../lib/authFormContext';

const ConfirmPasswordInput = React.memo(
  ({ shouldShow, t }: { shouldShow: boolean; t: TransFunction }) => {
    const form = useAuthFormContext();

    return (
      <Collapse in={shouldShow}>
        <PasswordInput
          required
          label={t('form.confirmPassword')}
          placeholder={t('form.confirmYourPassword')}
          {...form.getInputProps('confirmPassword')}
          radius="md"
          error={t(`${form.errors.confirmPassword ?? ''}`)}
        />
      </Collapse>
    );
  },
);

ConfirmPasswordInput.displayName = 'ConfirmPasswordInput';

export default ConfirmPasswordInput;
