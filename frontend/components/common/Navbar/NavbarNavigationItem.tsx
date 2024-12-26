import React, { useMemo } from 'react';
import { NavLink, Text } from '@mantine/core';
import Link from 'next/link';

import ROUTES from '@/utils/routes';
import {
  LinkItem,
  NavigationItem as NavItemType,
} from '@/types/navigationData';
import { usePathname } from 'next/navigation';
import { eq, filter, map, some, startsWith } from 'lodash';
import { useGlobalStore } from '@/stores/globalStore';

interface NavigationItemProps {
  item: NavItemType;
  lng: string;
}

const isLinkItem = (item: NavItemType): item is LinkItem =>
  item.type === 'link' || item.type === 'other';

const NavigationItem: React.FC<NavigationItemProps> = ({ item, lng }) => {
  const wholePathname = usePathname();
  const { setNavbarMobileOpened } = useGlobalStore();

  const ItemElement = useMemo(() => {
    const pathname = wholePathname.replace(`/${lng}`, '');
    if (item.type === 'divider' && (item.condition ?? true)) {
      return (
        <Text
          fz="xs"
          fw="bold"
          c="dimmed"
          mt="md"
          pl="sm"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {item.label}
        </Text>
      );
    }

    if (
      (item.type === 'link' || item.type === 'other') &&
      (item.condition ?? true)
    ) {
      const hasChildren = item.children && item.children.length > 0;
      const isActive =
        item.active ||
        eq(pathname, item.href) ||
        some(item.relatedRoutes, (route) => startsWith(pathname, route));

      const linkItems = filter(item.children, isLinkItem);
      const hasActiveChildren = linkItems.some((child) => child.active);
      const isClickableChild = item.href && !hasChildren;

      const defaultOpened =
        !item.alwaysClosed && (item.defaultOpened || hasActiveChildren);

      let component;
      if (item.type === 'other') component = 'div';
      else if (isClickableChild) component = Link;

      const children = map(linkItems, (child: LinkItem) => (
        <NavigationItem key={child.label} item={child} lng={lng} />
      ));

      return (
        <NavLink
          label={item.label}
          leftSection={item.icon}
          active={isActive}
          defaultOpened={defaultOpened}
          childrenOffset={16}
          onClick={() => {
            if (item.onClick) item.onClick();
            if (item.href) setNavbarMobileOpened(false);
          }}
          component={component as any}
          href={item.href && !hasChildren ? item.href : ROUTES.HOME}
        >
          {hasChildren && children}
        </NavLink>
      );
    }

    return null;
  }, [item, lng, wholePathname]);

  return ItemElement;
};

export default NavigationItem;
