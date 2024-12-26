import { Database } from '@/database.types';
import { createClient } from '@supabase/supabase-js';

const client = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
);

export const supabaseService = client;
