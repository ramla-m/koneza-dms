import apiService from "./apiService";
import { AuthUser } from "../store/authSlice";

export interface CreateUserPayload {
  email: string;
  first_name: string;
  last_name: string;
  role: "ADMIN" | "STAFF";
  password: string;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  role?: "ADMIN" | "STAFF";
  is_active?: boolean;
}

export const listUsers = (): Promise<AuthUser[]> =>
  apiService.get<AuthUser[]>("/api/users/").then((r) => r.data);

export const createUser = (payload: CreateUserPayload): Promise<AuthUser> =>
  apiService.post<AuthUser>("/api/users/", payload).then((r) => r.data);

export const updateUser = (id: number, payload: UpdateUserPayload): Promise<AuthUser> =>
  apiService.patch<AuthUser>(`/api/users/${id}/`, payload).then((r) => r.data);

export const deleteUser = (id: number): Promise<void> =>
  apiService.delete(`/api/users/${id}/`).then(() => undefined);
