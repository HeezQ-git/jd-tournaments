import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-datatable/styles.layer.css';
import 'mantine-contextmenu/styles.layer.css';
import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import Providers from '@/components/common/Providers/Providers';
import { ColorSchemeScript } from '@mantine/core';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Just Dance Tournaments',
  description:
    // eslint-disable-next-line max-len
    'Immerse yourself in the world of competitive gaming. Compete in Just Dance tournaments and climb the leaderboards.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
