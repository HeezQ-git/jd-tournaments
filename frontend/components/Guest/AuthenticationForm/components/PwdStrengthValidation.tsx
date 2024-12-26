import { Collapse, Divider, Flex, Text } from '@mantine/core';
import { keys, map } from 'lodash';
import React from 'react';
import PwdCheckbox from './PwdCheckbox';

const PwdStrengthValidation = ({
  focused,
  values,
  t,
}: {
  focused: boolean;
  values: any;
  t: TransFunction;
}) => {
  const StrengthElements = map(keys(values), (key) => (
    <PwdCheckbox key={key} name={key} pSV={values} t={t} />
  ));

  return (
    <Collapse in={focused}>
      <Flex direction="column" gap="xs">
        <Text fz="sm">{t('validation.password.title')}</Text>
        {StrengthElements}
      </Flex>
      <Divider my="sm" />
    </Collapse>
  );
};

export default PwdStrengthValidation;
