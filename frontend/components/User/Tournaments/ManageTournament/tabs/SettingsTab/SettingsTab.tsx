import { Divider, Flex, Select, Switch, TextInput } from '@mantine/core';
import React from 'react';
import { useTournamentsFormContext } from '../../tournamentsFormContext';
import PlatformsSelect from './PlatformsSelect';
import AnimatedItem from '../AnimatedItem';

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

const SettingsTab = () => {
  const form = useTournamentsFormContext();

  return (
    <Flex direction="column" gap="md">
      {/* <div>acc: participants (???)</div> */}
      <AnimatedItem>
        <Select
          data={verificationMethods}
          label="Score verification method"
          placeholder="Select verification method"
          defaultValue="both"
          allowDeselect={false}
          {...form.getInputProps('verificationMethod')}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.05}>
        <PlatformsSelect />
      </AnimatedItem>
      <AnimatedItem delay={0.1}>
        <TextInput
          label="Livestream link"
          placeholder="https://twitch.tv/yourstream"
          description="Link to the stream where the tournament will be broadcasted"
          {...form.getInputProps('livestreamLink')}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.15}>
        <Divider label="Tournament visibility" />
      </AnimatedItem>
      <AnimatedItem delay={0.2}>
        <Switch
          label="Allow comments"
          {...form.getInputProps('commentsAllowed', { type: 'checkbox' })}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.25}>
        <Switch
          label="Allow songs suggestions"
          description="You will receive other people's suggestions on what songs should be added"
          {...form.getInputProps('songsSuggestionsAllowed', {
            type: 'checkbox',
          })}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.3}>
        <Switch
          label="Private tournament"
          description="Only invited people will be able to participate"
          {...form.getInputProps('isPrivate', { type: 'checkbox' })}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.35}>
        <Switch
          label="Hide tournament from public list"
          description="Only people with a link will be able to see this tournament"
          {...form.getInputProps('isHidden', { type: 'checkbox' })}
        />
      </AnimatedItem>
      <AnimatedItem delay={0.4}>
        <Switch
          label="Tournament live chat enabled"
          description="Participants will be able to chat during the tournament"
          {...form.getInputProps('liveChat', { type: 'checkbox' })}
        />
      </AnimatedItem>

      {/* <div>
      <div>score/performance-based tournament?</div>
      <div>-- perf: voting, jury, brackets?</div>
      <div>banning songs here or in songs tab?</div>
    </div> */}
    </Flex>
  );
};

export default SettingsTab;
