'use server';

import { hasPermission } from '@/utils/permissionHandler/hasPermission';
import { supabaseService } from '@/utils/supabase/supabaseService';
import { useSupabaseServer } from '@/utils/supabase/supabaseSSR';
import { Song } from '@/types/song';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get('id');

  const supabase = useSupabaseServer();

  let result: Song | Song[];
  if (!id) {
    result = (await supabase.from('songs').select('*')).data as Song[];
  } else {
    result = (await supabase.from('songs').select('*').eq('id', id).single())
      .data as Song;
  }

  if (result) {
    if (Array.isArray(result)) {
      result = result.map((song) => {
        Object.keys(song).forEach((key: string) => {
          if (song[key as keyof Song] === 'NULL') (song as any)[key] = '';
        });
        return song;
      });
    } else {
      Object.keys(result).forEach((key) => {
        if ((result as Song)[key as keyof Song] === 'NULL')
          (result as any)[key] = '';
      });
    }
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const { allowAction, error: permError } = await hasPermission('songs.create');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  const song = JSON.parse(await request.text()) as Song;

  const { data, error } = await supabaseService.from('songs').insert(song);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ message: 'success', data }, { status: 201 });
}
