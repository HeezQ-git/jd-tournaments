import {
  Avatar,
  Divider,
  Flex,
  Group,
  Paper,
  Skeleton,
  Stack,
} from '@mantine/core';
import { motion } from 'framer-motion';
import styles from '../CreatedTournaments.module.css';

export const TournamentSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{
      duration: 0.75,
      repeat: Infinity,
      repeatType: 'reverse',
      delay: index * 0.1,
      ease: 'easeInOut',
    }}
  >
    <Paper w="100%" p="lg" shadow="xs" className={styles.tournament}>
      <Flex gap="md" align="center">
        <Stack gap="4px" align="center" px="sm" className={styles.date}>
          <Skeleton width={30} height={15} />
          <Skeleton width={40} height={30} />
        </Stack>
        <Divider orientation="vertical" />
        <Flex direction="column" gap="4px" w="100%">
          <Flex align="center" justify="space-between" w="100%">
            <Skeleton width={125} height={20} />
            <Skeleton width={100} height={20} />
          </Flex>
          <Flex justify="space-between" align="center">
            <Avatar.Group>
              <Avatar size="sm">
                <Skeleton radius="xl" width="100%" height="100%" />
              </Avatar>
              <Avatar size="sm">
                <Skeleton radius="xl" width="100%" height="100%" />
              </Avatar>
              <Avatar size="sm">
                <Skeleton radius="xl" width="100%" height="100%" />
              </Avatar>
            </Avatar.Group>
            <Group gap="2px" wrap="nowrap">
              <Skeleton width={68} height={20} />
              <Skeleton width={30} height={20} />
            </Group>
          </Flex>
        </Flex>
      </Flex>
    </Paper>
  </motion.div>
);
