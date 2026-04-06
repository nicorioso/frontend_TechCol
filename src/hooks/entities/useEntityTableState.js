import { useDeferredValue, useEffect, useMemo, useState } from 'react';

const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const getSearchableValue = (column, row) => {
  if (typeof column.searchValue === 'function') {
    return column.searchValue(row);
  }

  return row?.[column.key];
};

export default function useEntityTableState({
  columns = [],
  data = [],
  filters = {},
  itemsPerPage = 8,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() =>
    columns.filter((column) => !column.defaultHidden).map((column) => column.key)
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const statusColumnKey = filters.statusField || columns.find((column) => column.type === 'status')?.key;

  const searchableColumns = useMemo(
    () => columns.filter((column) => column.searchable !== false),
    [columns]
  );

  const statusOptions = useMemo(() => {
    if (!statusColumnKey) return [];

    return [...new Set(data.map((row) => String(row?.[statusColumnKey] ?? '').trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es'));
  }, [data, statusColumnKey]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = normalizeText(deferredSearchQuery);

    return data.filter((row) => {
      const matchesStatus =
        statusFilter === 'all' ||
        String(row?.[statusColumnKey] ?? '').trim().toLowerCase() === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return searchableColumns.some((column) =>
        normalizeText(getSearchableValue(column, row)).includes(normalizedQuery)
      );
    });
  }, [data, deferredSearchQuery, searchableColumns, statusColumnKey, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredRows, itemsPerPage]);

  const visibleColumns = useMemo(() => {
    return columns.filter((column) => visibleColumnKeys.includes(column.key));
  }, [columns, visibleColumnKeys]);

  const mobileColumns = useMemo(() => {
    return columns
      .filter((column) => column.mobile !== false)
      .sort((left, right) => (left.mobileOrder ?? 99) - (right.mobileOrder ?? 99));
  }, [columns]);

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumnKeys((previous) => {
      if (previous.includes(columnKey)) {
        if (previous.length === 1) return previous;
        return previous.filter((key) => key !== columnKey);
      }

      return [...previous, columnKey];
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return {
    currentPage,
    filteredRows,
    mobileColumns,
    paginatedRows,
    searchQuery,
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
    statusOptions,
    totalPages,
    toggleColumnVisibility,
    visibleColumnKeys,
    visibleColumns,
    resetFilters,
  };
}
