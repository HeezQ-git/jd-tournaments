import { useClickOutside, useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import { ContextMenuData } from './ContextMenu';

const useContextMenu = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [data, setData] = useState<ContextMenuData[]>([]);
  const [opened, { close, open }] = useDisclosure(false);
  const ref = useClickOutside(close);

  const showContextMenu = (
    event: React.MouseEvent,
    data: ContextMenuData[],
  ) => {
    event.preventDefault();
    open();

    const top = event.clientY;
    const left = event.clientX;

    setPosition({ top, left });
    setData(data);
  };

  return { showContextMenu, position, data, opened, close, ref };
};

export default useContextMenu;
