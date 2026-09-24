import { useCallback, useState } from 'react';
import './index.css';
import { useCourses } from './api/useCourses';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import SearchBox from './components/SearchBox';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Danh sách môn học</h1>
      <SearchBox onSearch={handleSearch} />
      <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
}

export default App;
