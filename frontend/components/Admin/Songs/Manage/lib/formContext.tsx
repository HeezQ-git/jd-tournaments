import { Song } from '@/types/song';
import { createFormContext, Form } from '@mantine/form';

export type FormValues = Omit<Omit<Song, 'id'>, 'created_at'>;

export const [SongFormProvider, useSongFormContext, useSongForm] =
  createFormContext<FormValues>();
