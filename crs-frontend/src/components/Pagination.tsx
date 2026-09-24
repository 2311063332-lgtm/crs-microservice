interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Phân trang" style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 24 }}>
      <button type="button" disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>
        &lt;&lt; Trang trước
      </button>

      {Array.from({ length: totalPages }, (_, page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
        >
          {page + 1}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Trang sau &gt;&gt;
      </button>
    </nav>
  );
}

export default Pagination;
