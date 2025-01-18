import React from 'react';
import { Flex, Group, MultiSelect, Text } from '@mantine/core';
import { TbBrandXbox, TbCheck, TbDeviceNintendo } from 'react-icons/tb';
import { FaPlaystation } from 'react-icons/fa';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const systems = [
  {
    value: 'xbox',
    label: 'Xbox',
  },
  {
    value: 'playstation',
    label: 'Playstation',
  },
  {
    value: 'switch',
    label: 'Nintendo Switch',
  },
];

const getIcon = (value: string, color: string) => {
  switch (value) {
    case 'xbox':
      return <TbBrandXbox size={19} color={color} />;
    case 'playstation':
      return <FaPlaystation size={19} color={color} />;
    case 'switch':
      return <TbDeviceNintendo size={19} color={color} />;
    default:
      return null;
  }
};

const PlatformsSelect = () => {
  const form = useTournamentsFormContext();
  return (
    <MultiSelect
      data={systems}
      label="Platform(s) allowed"
      placeholder="Select platform(s)"
      defaultValue={['switch']}
      {...form.getInputProps('platforms')}
      renderOption={({ option, checked }) => (
        <Flex align="center" w="100%" justify="space-between">
          <Group gap="xs">
            {getIcon(
              option.value,
              'light-dark(var(--mantine-color-dark-4), var(--mantine-color-gray-5))',
            )}
            <Text>{option.label}</Text>
          </Group>
          {checked && (
            <Flex align="center" mr="sm">
              <TbCheck
                size={18}
                color="light-dark(var(--mantine-color-dark-2), var(--mantine-color-gray-5))"
              />
            </Flex>
          )}
        </Flex>
      )}
    />
  );
};

export default PlatformsSelect;
