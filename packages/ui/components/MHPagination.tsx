import MHButton from "./MHButton";
import MHIcon from "./MHIcon";

interface IMHPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MHPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IMHPaginationProps) => {
  if (totalPages < 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="페이지 이동">
      <ul className="flex items-center justify-center gap-1">
        <li>
          <MHButton
            className="size-8 p-0"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            size="small"
            variant="ghost"
          >
            <span className="sr-only">이전 페이지</span>
            <MHIcon icon="arrowLeft" size={16} />
          </MHButton>
        </li>

        {pages.map((page) => {
          const isCurrentPage = page === currentPage;

          return (
            <li aria-current={isCurrentPage ? "page" : undefined} key={page}>
              <MHButton
                className="size-8 p-0"
                onClick={() => onPageChange(page)}
                size="small"
                variant={isCurrentPage ? "primary" : "ghost"}
              >
                {page}
              </MHButton>
            </li>
          );
        })}

        <li>
          <MHButton
            className="size-8 p-0"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            size="small"
            variant="ghost"
          >
            <span className="sr-only">다음 페이지</span>
            <MHIcon className="rotate-180" icon="arrowLeft" size={16} />
          </MHButton>
        </li>
      </ul>
    </nav>
  );
};

export default MHPagination;
