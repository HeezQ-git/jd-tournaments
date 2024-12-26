import { supabaseService } from '@/utils/supabase/supabaseService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const receivedData = await request.json();

  if (receivedData.id) {
    return NextResponse.json(
      { message: 'Tournament already exists' },
      { status: 400 },
    );
  }

  const tournamentData = {
    participants: receivedData.initialParticipants,
    ...receivedData,
    initialParticipants: undefined,
  };

  const { data, error, status } = await supabaseService
    .from('tournaments')
    .insert(tournamentData)
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status });
  }

  return NextResponse.json({ message: 'success', id: data?.id }, { status });
}

export async function PATCH(request: NextRequest) {
  const receivedData = await request.json();

  if (!receivedData.id) {
    return NextResponse.json(
      { message: 'Tournament ID not present' },
      { status: 404 },
    );
  }

  const tournamentData = {
    participants: receivedData.initialParticipants,
    ...receivedData,
    initialParticipants: undefined,
    id: undefined,
  };

  const { error, status } = await supabaseService
    .from('tournaments')
    .update(tournamentData)
    .eq('id', receivedData.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status });
  }

  return NextResponse.json({ message: 'success' }, { status: 200 });
}
