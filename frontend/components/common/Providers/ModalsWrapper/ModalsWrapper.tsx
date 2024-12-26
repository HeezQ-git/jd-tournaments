'use client';

import modals from '@/components/Modals/modals';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';

function ModalsWrapper({ children }: { children: React.ReactNode }) {
  return <ModalsProvider modals={modals}>{children}</ModalsProvider>;
}

export default ModalsWrapper;
