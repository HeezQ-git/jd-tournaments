import React from 'react';

export interface BaseItem {
  label: string;
  condition?: boolean;
}

export interface DividerItem extends BaseItem {
  type: 'divider';
}

export interface LinkItem extends BaseItem {
  type: 'link' | 'other';
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
  defaultOpened?: boolean;
  alwaysClosed?: boolean;
  onClick?: () => void;
  children?: DividerItem[] | LinkItem[];
  relatedRoutes?: string[];
}

export type NavigationItem = DividerItem | LinkItem;
