"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "@/types/dashboard";

// Pagination button component
const PaginationButton = ({
  onClick,
  disabled,
  children,
  ariaLabel,
  isActive = false,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  ariaLabel: string;
  isActive?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`pagination-btn p-2 rounded-md bg-[#F0F7EB80] text-[#11453B] hover:bg-[#11453B] hover:text-white ${
      isActive ? "pagination-active bg-[#11453B] text-white" : ""
    } ${
      disabled
        ? "pagination-disabled bg-gray-100 text-gray-400 cursor-not-allowed"
        : ""
    }`}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

export default function Pagination({
  totalItems,
  itemsPerPage = 6,
  onPageChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Items shown
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        onPageChange(newPage);
      }
    },
    [totalPages, onPageChange]
  );

  // Reset to page 1 when totalItems changes
  useEffect(() => {
    setCurrentPage(1);
    onPageChange(1);
  }, [totalItems, onPageChange]);

  // Generate page numbers (show up to 5 pages, with ellipsis for large ranges)
  const pageNumbers = useCallback(() => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage is at totalPages
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add first page and ellipsis
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages])();

  if (totalItems === 0) {
    return (
      <div className="pagination-container flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
        <div className="pagination-info text-sm text-gray-700">No results</div>
      </div>
    );
  }

  return (
    <div className="pagination-container flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
      {/* Showing number */}
      <div className="pagination-info text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex space-x-2">
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          ariaLabel="Previous page"
        >
          <ChevronLeft size={16} />
        </PaginationButton>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="pagination-ellipsis flex items-center text-gray-500 px-2"
            >
              ...
            </span>
          ) : (
            <PaginationButton
              key={page}
              onClick={() => handlePageChange(page as number)}
              disabled={false}
              ariaLabel={`Page ${page}`}
              isActive={currentPage === page}
            >
              {page}
            </PaginationButton>
          )
        )}

        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ariaLabel="Next page"
        >
          <ChevronRight size={16} />
        </PaginationButton>
      </div>
    </div>
  );
}
