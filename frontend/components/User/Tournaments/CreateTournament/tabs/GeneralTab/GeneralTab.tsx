import { Flex, Stack, Text, TextInput } from '@mantine/core';
import React from 'react';

import DescriptionEditor from './DescriptionEditor';
import InitialParticipants from './InitialParticipants';
import OrganisersList from './OrganisersList';
import AnimatedItem from '../AnimatedItem';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const GeneralTab = () => {
  const form = useTournamentsFormContext();

  return (
    <Flex w="100%" direction="column" gap="lg">
      <AnimatedItem delay={0.1}>
        <TextInput
          label="Tournament title"
          required
          w="100%"
          {...form.getInputProps('title')}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.2}>
        <Stack gap="0">
          <Text fz="sm" fw="500">
            Description
          </Text>
          <DescriptionEditor />
        </Stack>
      </AnimatedItem>
      <AnimatedItem delay={0.3}>
        <OrganisersList />
      </AnimatedItem>
      <AnimatedItem delay={0.4}>
        <InitialParticipants />
      </AnimatedItem>
    </Flex>
  );
};

export default GeneralTab;
