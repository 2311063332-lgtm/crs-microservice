import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getCourses } from './courseApi';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export type LoadState = 'loading' | 'success' | 'empty' | 'error';

const CONNECTION_ERROR_MESSAGE =
  'Không kết nối được tới hệ thống. Kiểm tra lại api-gateway đã chạy chưa.';

export function useCourses(keyword: string, page: number, size = 10) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCourses = useCallback(async () => {
    setState('loading');
    setErrorMessage('');

    try {
      const response = await getCourses(keyword, page, size);
      const { content, totalPages: responseTotalPages } = response.data;

      setCourses(content);
      setTotalPages(responseTotalPages);
      setState(content.length === 0 ? 'empty' : 'success');
    } catch (error: unknown) {
      setCourses([]);
      setTotalPages(0);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data?.message;
        setErrorMessage(
          error.response ? message ?? 'Đã xảy ra lỗi khi tải danh sách môn học.' : CONNECTION_ERROR_MESSAGE,
        );
      } else {
        setErrorMessage('Đã xảy ra lỗi không xác định.');
      }

      setState('error');
    }
  }, [keyword, page, size]);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  return { courses, totalPages, state, errorMessage, refetch: fetchCourses };
}
