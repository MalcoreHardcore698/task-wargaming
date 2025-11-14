import type { TUser } from "@/shared/types";

export interface IAuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Сохранены для совместимости с мок-хранилищем пользователей.
export interface ILoginCredentials extends Record<string, unknown> {
  email: string;
  password: string;
}

// Сохранены для совместимости с мок-хранилищем пользователей.
export interface IRegisterCredentials extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
}

// Сохранены для совместимости с прежней API-моделью.
export interface IResetPasswordCredentials extends Record<string, unknown> {
  email: string;
}

export interface IResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface IAuthResponse {
  user: TUser;
  token: string;
}

export interface IAuthContext extends IAuthState {
  play: (name: string) => Promise<void>;
  logout: () => void;
  me: () => Promise<void>;
}
