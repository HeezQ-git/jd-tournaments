import { Database } from '@/database.types';

export type User = Database['public']['Tables']['users']['Row'] & {
  email: string;
  avatar: string;
};

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  discord_id?: string;
}

export interface UpdateUserData {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}
