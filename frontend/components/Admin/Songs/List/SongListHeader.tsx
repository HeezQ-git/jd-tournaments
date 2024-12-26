import { Group, Text, Button } from '@mantine/core';
import Link from 'next/link';
import ROUTES from '@/utils/routes';
import { useHasPermission } from '@/utils/permissionHandler/useHasPermission';
import PERMISSIONS from '@/utils/permissions';
import { useMemo } from 'react';
import { TbMusicPlus } from 'react-icons/tb';

const SongListHeader = ({ t }: { t: TransFunction }) => {
  const canCreate = useHasPermission(PERMISSIONS.SONGS.CREATE);

  return useMemo(
    () => (
      <Group justify="space-between" w="100%">
        <Text fz="lg" tt="uppercase" fw="bolder">
          {t('list.title')}
        </Text>
        <Link href={ROUTES.ADMIN.SONG.ADD}>
          <Button
            size="sm"
            leftSection={<TbMusicPlus size={18} />}
            disabled={!canCreate}
          >
            {t('list.addSong')}
          </Button>
        </Link>
      </Group>
    ),
    [canCreate, t],
  );
};

export default SongListHeader;
