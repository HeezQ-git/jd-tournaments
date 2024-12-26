import { hasPermission } from '@/utils/permissionHandler/hasPermission';
import { supabaseService } from '@/utils/supabase/supabaseService';
import { generatePassword } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { allowAction, error: permError } = await hasPermission('users.delete');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json(
      { error: 'common:errors.user.idRequired' },
      { status: 400 },
    );
  }

  const { error: deleteUserError } =
    await supabaseService.auth.admin.deleteUser(id);

  if (deleteUserError) {
    return NextResponse.json(
      { error: deleteUserError.message },
      { status: deleteUserError.status },
    );
  }

  return NextResponse.json({ message: 'success' });
}

export async function PATCH(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { allowAction, error: permError } = await hasPermission('users.edit');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json(
      { error: 'common:errors.user.idRequired' },
      { status: 400 },
    );
  }

  const {
    email,
    generate_password: generatePassword,
    ...rest
  } = await request.json();

  if (email) {
    const { error: emailError } =
      await supabaseService.auth.admin.updateUserById(id, { email });

    if (emailError) {
      return NextResponse.json(
        { error: emailError.message },
        { status: emailError.status },
      );
    }
  }

  const { error: updateError } = await supabaseService
    .from('users')
    .update({
      ...rest,
    })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  let newPassword: string | undefined;

  if (generatePassword) {
    const { data: user } = await supabaseService
      .from('users')
      .select('discord_id')
      .eq('id', id)
      .single();
    const discordId = user?.discord_id || rest?.discord_id;

    if (!discordId) {
      return NextResponse.json(
        { error: 'Discord ID is required' },
        { status: 400 },
      );
    }

    newPassword = generatePassword();

    await fetch('http://localhost:3001/password-reset', {
      method: 'POST',
      body: JSON.stringify({ discordId, password: newPassword }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!user?.discord_id && rest?.discord_id) {
      await supabaseService
        .from('users')
        .update({ discord_id: rest.discord_id, is_verified: true })
        .eq('id', id);
    }
  }

  return NextResponse.json({ message: 'success' });
}
