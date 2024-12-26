import {
  Box,
  Checkbox,
  Divider,
  Flex,
  Group,
  MultiSelect,
  Select,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import React from 'react';
import { FaPlaystation } from 'react-icons/fa';
import { TbBrandXbox, TbCheck, TbDeviceNintendo } from 'react-icons/tb';
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

const verificationMethods = [
  {
    value: 'ocr',
    label: 'Photo text recognition (OCR)',
  },
  {
    value: 'manual',
    label: 'Manual',
  },
  {
    value: 'both',
    label: 'Both',
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

const SettingsTab = () => {
  const form = useTournamentsFormContext();

  return (
    <Flex direction="column" gap="md">
      {/* <div>acc: participants (???)</div> */}
      <Select
        data={verificationMethods}
        label="Score verification method"
        placeholder="Select verification method"
        defaultValue="both"
        allowDeselect={false}
        {...form.getInputProps('verificationMethod')}
      />
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
      <TextInput
        label="Livestream link"
        placeholder="https://twitch.tv/yourstream"
        description="Link to the stream where the tournament will be broadcasted"
        {...form.getInputProps('livestreamLink')}
      />
      <Divider label="Tournament visibility" />
      <Switch
        label="Allow comments"
        {...form.getInputProps('commentsAllowed')}
      />
      <Switch
        label="Allow songs suggestions"
        description="You will receive other people's suggestions on what songs should be added"
        {...form.getInputProps('songsSuggestionsAllowed')}
      />
      <Switch
        label="Private tournament"
        description="Only invited people will be able to participate"
        {...form.getInputProps('isPrivate')}
      />
      <Switch
        label="Hide tournament from public list"
        description="Only people with a link will be able to see this tournament"
        {...form.getInputProps('isHidden')}
      />
      <Switch
        label="Tournament live chat enabled"
        description="Participants will be able to chat during the tournament"
        {...form.getInputProps('liveChat')}
      />

      {/* <div>
      <div>score/performance-based tournament?</div>
      <div>-- perf: voting, jury, brackets?</div>
      <div>banning songs here or in songs tab?</div>
    </div> */}
    </Flex>
  );
};

export default SettingsTab;
