'use server';

import { supabaseService } from '@/utils/supabase/supabaseService';
import { useSupabaseServer } from '@/utils/supabase/supabaseSSR';
import { generateCode } from '@/utils/utils';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = useSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return NextResponse.json('');

  const code = generateCode();
  const { error } = await supabaseService
    .from('verification_codes')
    .upsert({ user_id: user?.id, code }, { onConflict: 'user_id' });

  if (error) return NextResponse.json('');
  return NextResponse.json(code);
}
