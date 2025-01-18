import { SimpleGrid } from '@mantine/core';
import React from 'react';
import {
  TbBrandTwitch,
  TbCloudLock,
  TbDeviceGamepad,
  TbDeviceMobile,
  TbEyeClosed,
  TbMessage,
  TbShield,
  TbUserQuestion,
} from 'react-icons/tb';
import { join } from 'lodash';
import InfoField from '../InfoField';
import { useDrawerStore } from '../store/drawerStore';

const SettingsSection = () => {
  const { tournament } = useDrawerStore();

  return (
    <SimpleGrid cols={{ base: 2, sm: 3 }}>
      <InfoField title="Score VM" icon={<TbShield />}>
        {tournament?.verificationMethod}
      </InfoField>
      <InfoField title="Platforms" icon={<TbDeviceGamepad />}>
        {join(tournament?.platforms, ', ')}
      </InfoField>
      <InfoField title="Camera scoring" icon={<TbDeviceMobile />}>
        {tournament?.cameraAllowed ? 'Enabled' : 'Disabled'}
      </InfoField>
      <InfoField title="Livestream link" icon={<TbBrandTwitch />}>
        {tournament?.livestreamLink || 'Not provided'}
      </InfoField>
      <InfoField title="Comments" icon={<TbMessage />}>
        {tournament?.commentsAllowed ? 'Enabled' : 'Disabled'}
      </InfoField>
      <InfoField title="Songs suggestions" icon={<TbUserQuestion />}>
        {tournament?.songsSuggestionsAllowed ? 'Enabled' : 'Disabled'}
      </InfoField>
      <InfoField title="Is private" icon={<TbCloudLock />}>
        {tournament?.isPrivate ? 'Yes' : 'No'}
      </InfoField>
      <InfoField title="Is hidden" icon={<TbEyeClosed />}>
        {tournament?.isHidden ? 'Yes' : 'No'}
      </InfoField>
    </SimpleGrid>
  );
};

export default SettingsSection;
