import { Badge } from '@mantine/core';
import { TbCloud, TbPencil, TbPointFilled } from 'react-icons/tb';

export const StatusBadge = ({
  isPublished,
  isLive,
}: {
  isPublished: boolean;
  isLive?: boolean;
}) => {
  if (isPublished && isLive) {
    return (
      <Badge
        size="sm"
        color="red"
        variant="filled"
        leftSection={<TbPointFilled />}
        miw="100px"
      >
        LIVE NOW
      </Badge>
    );
  }

  if (isPublished) {
    return (
      <Badge
        size="sm"
        color="blue"
        variant="filled"
        leftSection={<TbCloud />}
        miw="100px"
      >
        Published
      </Badge>
    );
  }

  return (
    <Badge
      size="sm"
      color="gray"
      variant="light"
      leftSection={<TbPencil />}
      miw="100px"
    >
      Draft
    </Badge>
  );
};
