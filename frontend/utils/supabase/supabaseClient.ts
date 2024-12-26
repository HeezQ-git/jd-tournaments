import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/database.types';

const client = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { isSingleton: true },
);

const supabase = () => client;

export default supabase;
