import React from 'react';
import ROUTES from '@/utils/routes';
import { UserMetadata } from '@supabase/supabase-js';

import { NavigationItem } from '@/types/navigationData';
import {
  TbList,
  TbMusic,
  TbMusicCode,
  TbMusicPlus,
  TbPlaylist,
  TbPlus,
  TbRosetteDiscountCheck,
  TbSwords,
  TbUsers,
} from 'react-icons/tb';
import { checkPermission } from './permissionHandler/checkPermission';

interface NavigationDataParams {
  userMetadata?: UserMetadata | null;
  isVerified?: boolean | null;
  currentPath: string;
  permissions?: string[] | null;
}

export const navigationData = (
  t: TransFunction,
  params: NavigationDataParams,
): NavigationItem[] => {
  const { userMetadata, isVerified, currentPath, permissions } = params;

  return [
    {
      type: 'divider',
      label: t('header.general'),
    },
    {
      type: 'link',
      label: t('header.verify'),
      icon: <TbRosetteDiscountCheck />,
      href: ROUTES.USER.VERIFY,
      condition: (userMetadata && !isVerified) ?? false,
    },
    {
      type: 'link',
      label: t('header.tournament.category'),
      icon: <TbSwords />,
      defaultOpened: currentPath.includes(ROUTES.USER.TOURNAMENT.SELF),
      children: [
        {
          type: 'link',
          label: t('header.tournament.list'),
          icon: <TbList />,
          href: ROUTES.USER.TOURNAMENT.LIST,
        },
        {
          type: 'link',
          label: t('header.tournament.create'),
          icon: <TbPlus />,
          href: ROUTES.USER.TOURNAMENT.CREATE,
        },
      ],
    },
    {
      type: 'divider',
      label: t('header.administration'),
      condition: checkPermission(
        ['access.songs', 'access.users'],
        permissions,
        true,
      ),
    },
    {
      type: 'link',
      label: t('header.songs.category'),
      icon: <TbMusic />,
      defaultOpened: currentPath.includes(ROUTES.ADMIN.SONG.SELF),
      condition: checkPermission('access.songs', permissions, true),
      children: [
        {
          type: 'link',
          label: t('header.songs.list'),
          icon: <TbPlaylist />,
          href: ROUTES.ADMIN.SONG.LIST,
          condition: checkPermission('access.songs.list', permissions),
        },
        {
          type: 'link',
          label: t('header.songs.add'),
          icon: <TbMusicPlus />,
          href: ROUTES.ADMIN.SONG.ADD,
          relatedRoutes: [ROUTES.ADMIN.SONG.EDIT],
          condition: checkPermission('access.songs.add', permissions),
        },
        {
          type: 'link',
          label: t('header.songs.bulk'),
          icon: <TbMusicCode />,
          href: ROUTES.ADMIN.SONG.BULK_ADD,
          condition: checkPermission('access.songs.bulkAdd', permissions),
        },
      ],
    },
    {
      type: 'link',
      label: t('header.users.list'),
      icon: <TbUsers />,
      href: ROUTES.ADMIN.USER.LIST,
      condition: checkPermission('access.users.list', permissions),
    },
  ];
};
