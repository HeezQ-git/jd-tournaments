'use server';

import { supabaseService } from '@/utils/supabase/supabaseService';
import { find, map } from 'lodash';
import { NextResponse } from 'next/server';

export async function GET() {
  const {
    data: { users },
  } = await supabaseService.auth.admin.listUsers();
  const { data: profiles } = await supabaseService.from('users').select('*');

  const userList = map(users, (user) => {
    const username = find(
      profiles,
      (profile) => profile.id === user.id,
    )?.username;

    return {
      id: user.id,
      avatar_url: user?.user_metadata?.avatar_url,
      username: username || user?.user_metadata?.username,
    };
  });

  return NextResponse.json(userList);
}
