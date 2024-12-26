'use server';

import { supabaseService } from '@/utils/supabase/supabaseService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username: string | null = searchParams.get('username');

  if (!username) return NextResponse.json(false);

  const { data } = await supabaseService
    .from('users')
    .select('is_verified')
    .eq('username', username)
    .single();
  return NextResponse.json(data?.is_verified || false);
}
