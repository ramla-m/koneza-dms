import apiService from "./apiService";
import { AuthUser } from "../store/authSlice";

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access: string;
}

export const login = (email: string, password: string): Promise<LoginResponse> =>
  apiService.post<LoginResponse>("/api/auth/login", { email, password }).then((r) => r.data);

export const refreshToken = (refresh: string): Promise<RefreshResponse> =>
  apiService.post<RefreshResponse>("/api/auth/refresh", { refresh }).then((r) => r.data);

export const getMe = (): Promise<AuthUser> =>
  apiService.get<AuthUser>("/api/auth/me").then((r) => r.data);
