import axiosClient from './axiosClient';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const login = (request: LoginRequest) =>
  axiosClient.post<LoginResponse>('/api/auth/login', request);
