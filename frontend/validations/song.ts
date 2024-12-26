import { Difficulty, Effort, Mode } from '@/types/song';
import { z } from 'zod';

export const songSchema = z.object({
  release_year: z.number({ message: 'validation.releaseYear.Req' }).positive({
    message: 'validation.releaseYear.Min',
  }),

  tags: z.array(z.string()).optional(),
  image_path: z.any().optional(),
  exclusivity: z.string().optional(),
  version: z.string().optional(),

  title: z.string().min(1, {
    message: 'validation.title.Req',
  }),
  artists: z.array(z.string()).min(1, {
    message: 'validation.artists.Req',
  }),
  game: z.string().min(1, {
    message: 'validation.game.Req',
  }),

  mode: z.nativeEnum(Mode, { message: 'validation.mode' }),
  difficulty: z.nativeEnum(Difficulty, {
    message: 'validation.difficulty',
  }),
  effort: z.nativeEnum(Effort, { message: 'validation.effort' }),

  jdplus_required: z.boolean().optional(),
  camera_supported: z.boolean().optional(),
});
