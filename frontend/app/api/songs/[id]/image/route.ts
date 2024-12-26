import { hasPermission } from '@/utils/permissionHandler/hasPermission';
import { supabaseService } from '@/utils/supabase/supabaseService';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { allowAction, error: permError } = await hasPermission('songs.edit');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json({ error: 'No song id provided' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('image_path') as File;

  if (!file) {
    return NextResponse.json({ message: 'No image found' }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const buffer = await sharp(fileBuffer)
    .resize({
      width: 500,
      fit: 'inside',
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  const ext = path.extname(file.name);
  const filename = path.join(
    `${file.name.replace(ext, '.jpeg').replace('%', '')}`,
  );
  const fullFilename = `${Date.now()}-${filename}`;

  try {
    const { data, error: imageError } = await supabaseService.storage
      .from('song_images')
      .upload(fullFilename, buffer);

    const { data: previousImage } = await supabaseService
      .from('songs')
      .select('image_path')
      .eq('id', id)
      .single();

    if (previousImage?.image_path) {
      try {
        await supabaseService.storage
          .from('song_images')
          .remove([previousImage.image_path]);
      } catch (error) {
        return NextResponse.json(
          { message: 'Failed to delete the previous image' },
          { status: 500 },
        );
      }
    }

    await supabaseService
      .from('songs')
      .update({ image_path: fullFilename })
      .eq('id', id);

    return NextResponse.json({ message: 'success', filename: fullFilename });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to save the image' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { allowAction, error: permError } = await hasPermission('songs.edit');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json({ error: 'No song id provided' }, { status: 400 });
  }

  const { data: song } = await supabaseService
    .from('songs')
    .select('image_path')
    .eq('id', id)
    .single();

  if (!song) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }

  if (song.image_path) {
    try {
      await supabaseService.storage
        .from('song_images')
        .remove([song.image_path]);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to delete the image' },
        { status: 500 },
      );
    }
  }

  await supabaseService.from('songs').update({ image_path: null }).eq('id', id);

  return NextResponse.json({ message: 'success' });
}
