import { Alert } from '@mantine/core';
import React from 'react';
import { TbAlertCircle } from 'react-icons/tb';
import { AnimatePresence, motion } from 'framer-motion';
import useDeepMemo from '@/hooks/useDeepMemo';
import { useTournamentsFormContext } from '../../tournamentsFormContext';

const MaxSongsAlert = () => {
  const form = useTournamentsFormContext();
  const { songSelection, maxSongs } = form.values;

  return useDeepMemo(
    () => (
      <AnimatePresence presenceAffectsLayout mode="sync">
        {songSelection === 'random' && !maxSongs && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            <Alert
              title="Warning!"
              color="orange"
              variant="light"
              icon={<TbAlertCircle size={24} />}
            >
              You must provide max songs limit to use the random song selection.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    [songSelection, maxSongs],
  );
};

export default MaxSongsAlert;
