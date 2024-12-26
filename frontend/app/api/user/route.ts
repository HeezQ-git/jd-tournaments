'use server';

import { hasPermission } from '@/utils/permissionHandler/hasPermission';
import { supabaseService } from '@/utils/supabase/supabaseService';
import { find, forEach, map } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const { allowAction, error: permError } = await hasPermission('users.read');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  const { data: profiles } = await supabaseService.from('users').select('*');
  const {
    data: { users },
  } = await supabaseService.auth.admin.listUsers();

  if (!profiles || !users) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    );
  }

  const profilesArray = map(profiles, (profile) => profile);
  const usersArray = map(users, (user) => user);
  const completeData: (typeof profiles & { email?: string })[] = [];

  forEach(profilesArray, (profile) => {
    const user = find(usersArray, (user) => user.id === profile.id);

    if (user) {
      completeData.push({
        ...profile,
        email: user?.email,
        avatar: user?.user_metadata?.avatar_url,
      } as any);
    }
  });

  return NextResponse.json(completeData);
}

export async function POST(request: NextRequest) {
  const { allowAction, error: permError } = await hasPermission('users.create');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  const {
    email,
    generate_password: _,
    password,
    ...rest
  } = await request.json();

  const {
    data: { user: createdUser },
    error: createUserError,
  } = await supabaseService.auth.admin.createUser({
    email,
    password,
  });

  if (createUserError && !createdUser) {
    return NextResponse.json(
      { error: createUserError.message },
      { status: createUserError.status },
    );
  }

  const { error } = await supabaseService
    .from('users')
    .insert({ id: createdUser?.id, ...rest });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'success' }, { status: 201 });
}
