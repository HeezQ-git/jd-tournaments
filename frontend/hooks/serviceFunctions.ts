'use server';

import { Database } from '@/database.types';
import { supabaseService } from '@/utils/supabase/supabaseService';

export const getDataWithService = async ({
  table,
  select,
  queryId,
}: {
  table?: keyof Database['public']['Tables'];
  select: string;
  queryId: string;
}) =>
  supabaseService
    .from(table ?? 'users')
    .select(select)
    .eq('id', queryId)
    .single();
