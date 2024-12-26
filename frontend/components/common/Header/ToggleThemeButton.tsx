import cx from 'clsx';
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group,
  Tooltip,
} from '@mantine/core';
import { TbMoon, TbSun } from 'react-icons/tb';
import classes from './Header.module.css';

const ToggleThemeButton = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  return (
    <Group justify="center">
      <Tooltip label="Toggle theme" withArrow openDelay={200}>
        <ActionIcon
          onClick={() =>
            setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
          }
          variant="default"
          aria-label="Toggle color scheme"
        >
          <TbSun className={cx(classes.icon, classes.light)} />
          <TbMoon className={cx(classes.icon, classes.dark)} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default ToggleThemeButton;
