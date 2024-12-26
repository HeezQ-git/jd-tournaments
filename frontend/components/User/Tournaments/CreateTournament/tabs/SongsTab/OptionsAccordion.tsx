import { Accordion } from '@mantine/core';
import React, { useState } from 'react';
import { TbMusic, TbSelect } from 'react-icons/tb';
import { Song } from '@/types/song';
import AccordionCustomControl from '../AccordionCustomControl';
import SongSelection from './SongSelection';
import SongSelector from './SongSelector';

const OptionsAccordion = ({
  songs,
  isRandomBS,
}: {
  songs?: Song[];
  isRandomBS: boolean;
}) => {
  const [openedPanel, setOpenedPanel] = useState<string[]>(['selection']);

  return (
    <Accordion
      variant="separated"
      multiple
      onChange={(value) => setOpenedPanel(value)}
      value={openedPanel}
      mt="sm"
    >
      <Accordion.Item value="selection">
        <AccordionCustomControl icon={<TbSelect />} title="Song selection" />
        <Accordion.Panel>
          <SongSelection isRandomBS={isRandomBS} />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="songs">
        <AccordionCustomControl
          // disabled={songSelection !== 'manual'}
          icon={<TbMusic />}
          title="Song list"
        />
        <Accordion.Panel>
          <SongSelector songs={songs} isRandomBS={isRandomBS} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default OptionsAccordion;
