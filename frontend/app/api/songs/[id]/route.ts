'use server';

import { hasPermission } from '@/utils/permissionHandler/hasPermission';
import { supabaseService } from '@/utils/supabase/supabaseService';
import { Song } from '@/types/song';
import { NextResponse } from 'next/server';

export async function DELETE(
  _: Request,
  { params: { id } }: { params: { id: string } },
) {
  const { allowAction, error: permError } = await hasPermission('songs.delete');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  const deleted = await supabaseService.from('songs').delete().eq('id', id);

  return NextResponse.json(deleted.status);
}

export async function PATCH(
  request: Request,
  { params: { id } }: { params: { id: string } },
) {
  const { allowAction, error: permError } = await hasPermission('songs.edit');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json({ error: 'No song id provided' }, { status: 400 });
  }

  const song = JSON.parse(await request.text()) as Song;

  const { data, error } = await supabaseService
    .from('songs')
    .update(song)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ message: 'success', data }, { status: 200 });
}
