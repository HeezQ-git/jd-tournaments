import { hasPermission } from '@/utils/permissionHandler/hasPermission';
import { supabaseService } from '@/utils/supabase/supabaseService';
import { map } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const { allowAction, error: permError } =
    await hasPermission('permissions.read');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  const { data: permissions } = await supabaseService
    .from('permissions')
    .select('*');

  return NextResponse.json(permissions);
}

export async function POST(request: NextRequest) {
  const { allowAction, error: permError } =
    await hasPermission('permissions.edit');

  if (!allowAction || permError) {
    return NextResponse.json({ error: permError }, { status: 403 });
  }

  const { userId, userPermissions } = await request.json();

  const permissionList = map(userPermissions, 'id');

  const { error } = await supabaseService
    .from('user_permissions')
    .delete()
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  if (permissionList.length) {
    const { error: insertError } = await supabaseService
      .from('user_permissions')
      .insert(
        map(permissionList, (permissionId) => ({
          user_id: userId,
          permission_id: permissionId,
        })),
      );

    if (insertError) {
      return NextResponse.json({ error: insertError }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
