import { useMemo, useState } from 'react';
import {
  UnstyledButton,
  Menu,
  Image,
  Group,
  rem,
  Avatar,
  Button,
  Flex,
} from '@mantine/core';
import { languages } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import clsx from 'clsx';
import { useMediaQuery } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useGlobalStore } from '@/stores/globalStore';
import { notifications } from '@mantine/notifications';
import { TbChevronRight, TbRefresh } from 'react-icons/tb';
import classes from './Navbar.module.css';
import { theme } from '../Providers/MantineWrapper/MantineWrapper';

export const LanguagePicker = ({ lng }: { lng: string }) => {
  const { t } = useTranslation(lng);

  const [selected, setSelected] = useState(lng);

  const { setNavbarMobileOpened } = useGlobalStore();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.sm})`);
  const pathname = usePathname();

  const items = languages.map((lang) => (
    <Menu.Item
      component={Link}
      leftSection={
        <Image src={`/images/${lang}.png`} width={18} height={18} alt={lang} />
      }
      onClick={() => {
        if (lang === selected) return;

        setSelected(lang);
        setNavbarMobileOpened(false);

        notifications.show({
          title: t('languageChanged.title', { lng: lang }),
          message: t('languageChanged.message', { lng: lang }),
        });
      }}
      key={lang}
      className={clsx(lang === selected && classes.selected)}
      href={`/${lang}${pathname.replace(`/${lng}`, '')}`}
    >
      ({lang.toUpperCase()}) {t(`languages.${lang}`)}
    </Menu.Item>
  ));

  return (
    <Menu
      width="target"
      withArrow
      arrowPosition="side"
      position={isMobile ? 'top' : 'right'}
    >
      <Menu.Target>
        <UnstyledButton className={classes.control}>
          <Group gap="xs" w="100%">
            <Avatar src={`/images/${selected}.png`} radius="xl" size="sm" />
            <span className={classes.label}>{t(`languages.${selected}`)}</span>
          </Group>
          <TbChevronRight style={{ width: rem(14), height: rem(14) }} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown maw="90%" miw={isMobile ? '90%' : '250'}>
        {items}
      </Menu.Dropdown>
    </Menu>
  );
};
