import { Song } from '@/types/song';
import { createFormContext } from '@mantine/form';

export type FormValues = Omit<
  Omit<Omit<Song, 'id'>, 'created_at'>,
  'duration'
> & {
  duration: string;
};

export const [SongFormProvider, useSongFormContext, useSongForm] =
  createFormContext<FormValues>();
