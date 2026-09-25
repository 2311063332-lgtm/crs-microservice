import axiosClient from './axiosClient';
import type { Course, PagedResponse } from '../types/course';

export const getCourses = (keyword?: string, page = 0, size = 10) =>
  axiosClient.get<PagedResponse<Course>>('/api/courses', {
    params: { keyword, page, size },
  });

export const getCourseById = (id: number) =>
  axiosClient.get<Course>(`/api/courses/${id}`);
