'use server';

import { supabaseService } from '../supabase/supabaseService';

export const getUserPermissions = async (userId: string) =>
  supabaseService
    .from('user_permissions')
    .select('permissions ( id, name )')
    .eq('user_id', userId);
