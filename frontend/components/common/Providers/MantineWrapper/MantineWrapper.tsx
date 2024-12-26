'use client';

import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ContextMenuProvider } from 'mantine-contextmenu';
import React from 'react';

export const theme = createTheme({
  primaryColor: 'teal',
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  colors: {
    rose: [
      '#ffeafa',
      '#fdd3ed',
      '#f5a6d6',
      '#ee76be',
      '#e74dab',
      '#e4339e',
      '#e32498',
      '#ca1585',
      '#b50b76',
      '#9f0067',
    ],
  },
});

function MantineWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <ContextMenuProvider>
        <Notifications />
        {children}
      </ContextMenuProvider>
    </MantineProvider>
  );
}

export default MantineWrapper;
