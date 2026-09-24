export type UserRole = 'ADMIN' | 'STUDENT';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: UserRole;
}

export interface AuthUser {
  username: string;
  role: UserRole;
}
