'use server';

import { supabaseService } from '@/utils/supabase/supabaseService';

const getEmail = async (identifier: string) => {
  if (identifier.includes('@')) return identifier;

  const { data } = await supabaseService
    .from('users')
    .select('id')
    .eq('username', identifier)
    .single();
  if (!data?.id) return undefined;

  const { data: userData } = await supabaseService.auth.admin.getUserById(
    data.id,
  );
  return userData.user!.email;
};

export const register = async (
  email: string,
  username: string,
  password: string,
): Promise<any> => {
  const { data: user, error } = await supabaseService.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  return user?.user ? user : error?.code;
};

export const login = async (identifier: string, password: string) => {
  const email = await getEmail(identifier);
  if (!email) return { error: 'validation.userNotFound' };

  const { data, error } = await supabaseService.auth.signInWithPassword({
    email,
    password,
  });

  return data?.user ? data : error?.code;
};
