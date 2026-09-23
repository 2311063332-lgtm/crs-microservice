import axiosClient from './axiosClient';
import type { Registration, RegistrationRequest } from '../types/registration';

export const createRegistration = (request: RegistrationRequest) =>
  axiosClient.post<Registration>('/api/registrations', request);

export const getMyRegistrations = () =>
  axiosClient.get<Registration[]>('/api/registrations/me');

export const cancelRegistration = (id: number) =>
  axiosClient.delete(`/api/registrations/${id}`);
