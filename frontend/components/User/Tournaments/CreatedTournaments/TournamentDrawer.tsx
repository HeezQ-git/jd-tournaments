import { Divider, Drawer, Flex, ScrollArea, Text } from '@mantine/core';
import React, { useMemo } from 'react';
import {
  GeneralSection,
  RecurrencesSection,
  ScheduleSection,
  SettingsSection,
  SongsSection,
} from './sections';
import { useDrawerStore } from './store/drawerStore';

const TournamentDrawer = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const { tournament } = useDrawerStore();

  return useMemo(
    () => (
      <Drawer
        offset={8}
        radius="sm"
        size="lg"
        opened={opened}
        onClose={close}
        position="right"
        title={
          <Text fw="500" fz="h4">
            {tournament?.title}
          </Text>
        }
        scrollAreaComponent={ScrollArea.Autosize.withProps({
          scrollbarSize: 8,
        })}
      >
        <Flex direction="column" gap="xl">
          <GeneralSection />
          <Divider label="Schedule" />
          <ScheduleSection />
          <Divider label="Songs" />
          <SongsSection />
          <Divider label="Recurrences" />
          <RecurrencesSection />
          <Divider label="Settings" />
          <SettingsSection />
        </Flex>
      </Drawer>
    ),
    [opened, close, tournament],
  );
};

export default TournamentDrawer;
