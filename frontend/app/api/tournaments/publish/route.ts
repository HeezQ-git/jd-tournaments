import { supabaseService } from '@/utils/supabase/supabaseService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { id, isPublished } = await request.json();

  if (!id) {
    return NextResponse.json(
      { message: 'Tournament ID not present' },
      { status: 404 },
    );
  }

  if (isPublished === undefined) {
    return NextResponse.json(
      { message: 'isPublished not present' },
      { status: 400 },
    );
  }

  const { error, status } = await supabaseService
    .from('tournaments')
    .update({ isPublished })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status });
  }

  return NextResponse.json({ message: 'success' }, { status: 200 });
}
