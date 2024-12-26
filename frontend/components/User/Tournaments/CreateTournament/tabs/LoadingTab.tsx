import { Flex, Loader, Text } from '@mantine/core';
import React from 'react';

const LoadingTab = () => (
  <Flex align="center" justify="center" gap="md">
    <Loader size="md" type="oval" />
  </Flex>
);

export default LoadingTab;
