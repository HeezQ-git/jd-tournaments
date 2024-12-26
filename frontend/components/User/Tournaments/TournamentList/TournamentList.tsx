'use client';

import { Flex } from '@mantine/core';
import React, { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import TournamentCard from './TournamentCard';
import styles from './Tournament.module.css';

const TournamentList = () => {
  const autoplay = useRef(Autoplay({ delay: 7500 }));

  return (
    <Flex h="100%" align="center" justify="center">
      <Carousel
        align="start"
        slideSize="275px"
        slideGap="md"
        maw={275 * 4}
        loop
        classNames={{ control: styles.control }}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        styles={{ controls: { left: '-60px', right: '-44px' } }}
      >
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
      </Carousel>
    </Flex>
  );
};

export default TournamentList;
