import { useState, useMemo } from 'react'

export function usePagination(data, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, itemsPerPage])

  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  // Reset to page 1 when data changes significantly
  const resetPage = () => {
    setCurrentPage(1)
  }

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    resetPage,
    itemsPerPage,
  }
}

export default usePagination
