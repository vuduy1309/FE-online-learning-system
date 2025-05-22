// src/components/CoursePagination.js
import { Pagination } from "react-bootstrap";
import { useCourseContext } from "../../context/CourseContext";

export default function CoursePagination() {
  const { currentPage, totalPages, handlePageChange } = useCourseContext();

  if (totalPages <= 1) {
    return null;
  }

  // Generate pagination items
  const paginationItems = [];
  
  // If there are many pages, we will show only a window of pages around the current page
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust the start page if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  // Ellipsis before start page
  if (startPage > 1) {
    paginationItems.push(
      <Pagination.Item key="ellipsis-start" disabled>
        ...
      </Pagination.Item>
    );
  }
  
  // Page numbers
  for (let number = startPage; number <= endPage; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  
  // Ellipsis after end page
  if (endPage < totalPages) {
    paginationItems.push(
      <Pagination.Item key="ellipsis-end" disabled>
        ...
      </Pagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        <Pagination.First 
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1} 
        />
        <Pagination.Prev 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1} 
        />
        
        {paginationItems}
        
        <Pagination.Next 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages} 
        />
        <Pagination.Last 
          onClick={() => handlePageChange(totalPages)} 
          disabled={currentPage === totalPages} 
        />
      </Pagination>
    </div>
  );
}