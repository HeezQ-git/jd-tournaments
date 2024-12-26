import { Checkbox } from '@mantine/core';
import React from 'react';

const PwdCheckbox = ({
  t,
  pSV,
  name,
}: {
  pSV: any;
  name: string;
  t: (_: string) => string;
}) => (
  <Checkbox
    label={t(`validation.password.${name}`)}
    checked={pSV[name]}
    c={pSV[name] ? 'gray' : 'dimmed'}
    readOnly
    tabIndex={-1}
  />
);

export default PwdCheckbox;
