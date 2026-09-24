import { useCallback, useState } from 'react';
import { useCourses } from '../api/useCourses';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import SearchBox from '../components/SearchBox';

function CoursesPage() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);
  const handleSearch = useCallback((value: string) => { setKeyword(value); setPage(0); }, []);

  return <section>
    <h1>Danh sách môn học</h1>
    <SearchBox onSearch={handleSearch} />
    <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch} />
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
  </section>;
}

export default CoursesPage;
