import { Flex, Loader, Text } from '@mantine/core';
import React from 'react';

function Loading({ text }: { text?: string }) {
  return (
    <Flex direction="column" justify="center" align="center" w="100%">
      <Loader type="bars" size="lg" />
      <Text
        variant="gradient"
        gradient={{
          from: 'teal',
          to: 'cyan',
        }}
        style={{
          backgroundPosition: '0 100%',
          backgroundSize: '300% 400%',
          backgroundRepeat: 'no-repeat',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'bg 5s ease infinite',
        }}
        fw="bold"
        fz="xl"
      >
        {text || 'Loading...'}
      </Text>
    </Flex>
  );
}

export default Loading;
