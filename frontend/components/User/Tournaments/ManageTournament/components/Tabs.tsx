import { Tabs } from '@mantine/core';
import dynamic from 'next/dynamic';
import React from 'react';
import {
  TbCalendarDue,
  TbListTree,
  TbMusic,
  TbPhoto,
  TbSettings,
} from 'react-icons/tb';
import LoadingTab from '../tabs/LoadingTab';
import GeneralTab from '../tabs/GeneralTab/GeneralTab';

const ScheduleTab = dynamic(() => import('../tabs/ScheduleTab/ScheduleTab'), {
  loading: LoadingTab,
});
const SongsTab = dynamic(() => import('../tabs/SongsTab/SongsTab'), {
  loading: LoadingTab,
});
const MediaTab = dynamic(() => import('../tabs/MediaTab/MediaTab'), {
  loading: LoadingTab,
});
const SettingsTab = dynamic(() => import('../tabs/SettingsTab/SettingsTab'), {
  loading: LoadingTab,
});

const TabPanels = ({
  active,
  setActive,
}: {
  active: string | null;
  setActive: (value: string | null) => void;
}) => (
  <Tabs keepMounted={false} value={active} onChange={setActive}>
    <Tabs.List mb="lg">
      <Tabs.Tab value="general" leftSection={<TbListTree />}>
        General
      </Tabs.Tab>
      <Tabs.Tab value="schedule" leftSection={<TbCalendarDue />}>
        Schedule
      </Tabs.Tab>
      <Tabs.Tab value="songs" leftSection={<TbMusic />}>
        Songs
      </Tabs.Tab>
      <Tabs.Tab value="media" leftSection={<TbPhoto />} disabled>
        Media
      </Tabs.Tab>
      <Tabs.Tab value="settings" leftSection={<TbSettings />}>
        Settings
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="general">
      <GeneralTab />
    </Tabs.Panel>
    <Tabs.Panel value="schedule">
      <ScheduleTab setActive={setActive} />
    </Tabs.Panel>
    <Tabs.Panel value="songs">
      <SongsTab />
    </Tabs.Panel>
    <Tabs.Panel value="media">
      <MediaTab />
    </Tabs.Panel>
    <Tabs.Panel value="settings">
      <SettingsTab />
    </Tabs.Panel>
  </Tabs>
);

export default TabPanels;
