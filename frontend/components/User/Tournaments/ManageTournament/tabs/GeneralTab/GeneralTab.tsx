import { Flex, Stack, Text, TextInput } from '@mantine/core';
import React from 'react';

import DescriptionEditor from './DescriptionEditor';
import Participants from './Participants';
import OrganisersList from './OrganisersList';
import AnimatedItem from '../AnimatedItem';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const GeneralTab = () => {
  const form = useTournamentsFormContext();

  return (
    <Flex w="100%" direction="column" gap="lg">
      <AnimatedItem>
        <TextInput
          label="Tournament title"
          required
          w="100%"
          {...form.getInputProps('title')}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.05}>
        <Stack gap="0">
          <Text fz="sm" fw="500">
            Description
          </Text>
          <DescriptionEditor />
        </Stack>
      </AnimatedItem>
      <AnimatedItem delay={0.1}>
        <OrganisersList />
      </AnimatedItem>
      <AnimatedItem delay={0.15}>
        <Participants />
      </AnimatedItem>
    </Flex>
  );
};

export default GeneralTab;
