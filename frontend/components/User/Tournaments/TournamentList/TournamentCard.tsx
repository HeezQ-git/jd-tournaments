'use client';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Paper,
  Text,
} from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import { FaFire } from 'react-icons/fa';
import { TbListDetails, TbUsers } from 'react-icons/tb';
import { Carousel } from '@mantine/carousel';
import styles from './Tournament.module.css';

const TournamentCard = () => (
  <Carousel.Slide>
    <Card shadow="sm" p="md" withBorder className={styles.card}>
      <Card.Section>
        <Box className={styles.imageContainer}>
          <Image
            src="/images/default_cover.jpg"
            alt="Tournament"
            width={300}
            height={200}
            className={styles.image}
            loading="lazy"
          />
        </Box>
      </Card.Section>
      <Badge
        variant="gradient"
        gradient={{ from: 'orange', to: 'red' }}
        className={styles.popularBadge}
        leftSection={<FaFire />}
      >
        Popular
      </Badge>
      <Flex direction="column" gap="0" mt="sm">
        <Text size="xs" c="dimmed">
          NOV 12 • Starting at 10:00 AM
        </Text>
        <Text size="lg" fw="bold">
          Tournament Name
        </Text>
      </Flex>
      <Flex gap="4px" mt="xs" maw="100%" wrap="wrap">
        <Badge color="gray" size="md" radius="sm">
          JD2024
        </Badge>
        <Badge color="gray" size="md" radius="sm">
          Fun
        </Badge>
      </Flex>
      <Divider my="sm" />
      <Flex direction="column">
        <Text fz="xs" c="dimmed">
          Participants
        </Text>
        <Flex align="center" gap="4px">
          <TbUsers />
          <Text fw={600} fz="sm">
            12/16
          </Text>
        </Flex>
      </Flex>
      <Card.Section mt="xs">
        <Paper p="xs" radius="0" className={styles.bottomActions}>
          <Flex align="center" justify="space-between">
            <Flex gap="xs" align="center">
              <Avatar size="sm" />
              <Flex direction="column" gap="0">
                <Text c="dimmed" fz="xs">
                  Organised by
                </Text>
                <Text fz="sm" fw={600} mt="-4px">
                  JDTeam
                </Text>
              </Flex>
            </Flex>
            <Button size="xs" variant="light" leftSection={<TbListDetails />}>
              Details
            </Button>
          </Flex>
        </Paper>
      </Card.Section>
    </Card>
  </Carousel.Slide>
);

export default TournamentCard;
