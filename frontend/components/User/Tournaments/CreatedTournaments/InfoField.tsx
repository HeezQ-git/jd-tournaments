import { Group, Stack, Text } from '@mantine/core';

const InfoField = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  children: React.ReactNode;
}) => (
  <Stack gap="4px" h="max-content">
    <Group gap="xs" align="center" c="dimmed" wrap="nowrap" fz="sm">
      {icon}
      <Text fz="inherit">{title}</Text>
    </Group>
    <Text fz={{ base: 'sm', sm: 'md' }} span>
      {children}
    </Text>
  </Stack>
);

export default InfoField;
