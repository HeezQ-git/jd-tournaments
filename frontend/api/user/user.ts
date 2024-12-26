import { fetchAPI } from '@/app/api/apiFunctions';
import { usersEndpoints } from '@/app/api/endpoints';
import {
  CreateUserData,
  UpdateUserData,
  User,
  UserResponse,
} from '@/types/user';

export const createUser = async (data: CreateUserData): Promise<UserResponse> =>
  fetchAPI<UserResponse>(usersEndpoints.create, { data });

export const deleteUser = async (id: string): Promise<UserResponse> =>
  fetchAPI<UserResponse>(usersEndpoints.delete, { slugs: { id } });

export const editUser = async (data: UpdateUserData): Promise<User> =>
  fetchAPI<User>(usersEndpoints.edit, {
    data: { ...data, id: undefined },
    slugs: { id: data?.id },
  });
