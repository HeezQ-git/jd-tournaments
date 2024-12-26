import { Button, Divider, Flex, Paper, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './ContextMenu.module.css';

export type ContextMenuData = {
  type?: 'divider' | 'button' | 'text';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  icon?: React.ReactNode;
  color?: string;
  href?: string;
};

type ContextMenuProps = {
  data?: ContextMenuData[];
  minWidth?: number;
  top: number;
  left: number;
  close: () => void;
  opened?: boolean;
};

// eslint-disable-next-line react/display-name
const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ data, minWidth = 200, top, left, close, opened }, ref) => {
    const router = useRouter();

    return (
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.1 }}
            style={{ position: 'fixed', top: top + 7, left }}
            ref={ref}
          >
            <Paper
              bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))"
              miw={minWidth}
              withBorder
              className={styles.container}
            >
              <Flex direction="column" p="4">
                {data?.map((item: ContextMenuData, index: number) => {
                  const key = `${item.label}-${index}`;

                  if (item.type === 'divider') {
                    return <Divider key={key} mt="6" />;
                  }

                  if (item.type === 'text') {
                    return (
                      <Text key={key} c="dimmed" fz="xs" px="sm" mt="8" mb="6">
                        {item.label}
                      </Text>
                    );
                  }

                  return (
                    <Button
                      key={key}
                      variant="subtle"
                      className={clsx(!item.color && styles.button)}
                      color={
                        item.color ||
                        'var(--menu-item-color, var(--mantine-color-text))'
                      }
                      fw="normal"
                      py="0"
                      px="md"
                      styles={{
                        inner: {
                          justifyContent: 'flex-start',
                        },
                      }}
                      leftSection={item.icon}
                      onClick={(e) => {
                        item.onClick?.(e);
                        close?.();

                        if (item.href) router.push(item.href);
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Flex>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

export default ContextMenu;
