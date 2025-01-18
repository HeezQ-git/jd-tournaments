import { supabaseService } from '@/utils/supabase/supabaseService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { message: 'User ID not present' },
      { status: 404 },
    );
  }

  const { data: tournaments } = await supabaseService
    .from('tournaments')
    .select('*')
    .eq('creatorId', id as string);

  return NextResponse.json(tournaments);
}
