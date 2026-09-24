import { useEffect, useState } from 'react';

interface SearchBoxProps {
  onSearch: (keyword: string) => void;
}

function SearchBox({ onSearch }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearch(inputValue.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <input
      type="search"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      placeholder="Tìm kiếm môn học..."
      aria-label="Tìm kiếm môn học"
      style={{
        width: '100%',
        maxWidth: 400,
        padding: '8px 12px',
        fontSize: 14,
        border: '1px solid #ccc',
        borderRadius: 6,
        boxSizing: 'border-box',
      }}
    />
  );
}

export default SearchBox;
