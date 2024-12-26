import { theme } from '@/components/common/Providers/MantineWrapper/MantineWrapper';

import { Flex, Group, Pagination, Text, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

const SongPagination = ({
  page,
  setPage,
  totalPages,
  t,
}: {
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
  t: TransFunction;
}) => {
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (Number.isNaN(value) || (value >= 1 && value <= totalPages)) {
      setPage(value);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      gap="md"
      mt="xl"
      direction={{ base: 'column', md: 'row' }}
    >
      <Pagination
        total={totalPages}
        value={page}
        onChange={setPage}
        size={isMobile ? 'sm' : 'md'}
        hideWithOnePage
      />
      <Group>
        {isMobile && (
          <Text fz="sm" c="dimmed">
            {t('page')}:
          </Text>
        )}
        <TextInput
          value={page}
          onChange={handleInputChange}
          type="number"
          min={1}
          max={totalPages}
          size={isMobile ? 'xs' : 'sm'}
          w={50}
        />
      </Group>
    </Flex>
  );
};

export default SongPagination;
