import { AppShell, ScrollArea } from '@mantine/core';
import React from 'react';
import { User, UserMetadata } from '@supabase/supabase-js';
import NavbarNavigation from './NavbarNavigation';
import styles from './Navbar.module.css';
import NavbarUserButton from './NavbarUserButton';
import { LanguagePicker } from './LanguageSelector';

const Navbar = ({
  lng,
  metadata,
  isVerified,
  permissions,
}: {
  lng: string;
  metadata: UserMetadata | null;
  isVerified: boolean | null;
  permissions: string[] | null;
}) => (
  <AppShell.Navbar className={styles.navbar}>
    <AppShell.Section grow my="md" component={ScrollArea} scrollbarSize={4}>
      <NavbarNavigation
        lng={lng}
        initialMetadata={metadata}
        initialIsVerified={isVerified}
        initialPermissions={permissions}
      />
    </AppShell.Section>
    <AppShell.Section>
      <LanguagePicker lng={lng} />
      <NavbarUserButton lng={lng} initialMetadata={metadata} />
    </AppShell.Section>
  </AppShell.Navbar>
);

export default Navbar;
