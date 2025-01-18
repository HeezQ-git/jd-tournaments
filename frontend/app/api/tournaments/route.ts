import { supabaseService } from '@/utils/supabase/supabaseService';
import { map } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { message: 'Tournament ID not present' },
      { status: 404 },
    );
  }

  const { data, error, status } = await supabaseService
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status });
  }

  const tournament = data;
  if (tournament.recurrences) {
    tournament.recurrences = map(tournament.recurrences, (recurrence) =>
      JSON.parse(recurrence),
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const receivedData = await request.json();

  if (receivedData.id) {
    return NextResponse.json(
      { message: 'Tournament already exists' },
      { status: 400 },
    );
  }

  const { data, error, status } = await supabaseService
    .from('tournaments')
    .insert(receivedData)
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
    ...receivedData,
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
