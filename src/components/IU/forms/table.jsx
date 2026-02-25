import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from './button';
import { SelectInput } from './selectInput';

export const Table = ({
  title = 'Tabla',
  data = [],
  columns = [],
  actionButtonLabel = 'ACCIÓN',
  onActionClick = () => {},
  onEditClick = () => {},
  onDeleteClick = () => {},
  itemsPerPage = 10,
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key));
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  const totalPages = Math.ceil(safeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = safeData.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelected = new Set(paginatedData.map((_, idx) => startIndex + idx));
      setSelectedRows(newSelected);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const toggleColumnVisibility = (columnKey) => {
    const newVisible = visibleColumns.includes(columnKey)
      ? visibleColumns.filter(key => key !== columnKey)
      : [...visibleColumns, columnKey];
    setVisibleColumns(newVisible);
  };

  const allChecked = paginatedData.length > 0 && paginatedData.every((_, idx) => selectedRows.has(startIndex + idx));

  return (
    <div className="w-full bg-white rounded-lg p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end sm:gap-4">
          {/* Column Selector */}
          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300"
            >
              <span>Mostrar</span>
              <span className="font-semibold">TODAS LAS COLUMNAS</span>
              <ChevronLeftIcon className={`w-4 h-4 transition-transform ${showColumnDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showColumnDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => toggleColumnVisibility(col.key)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => onActionClick(Array.from(selectedRows))}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white"
          >
            {actionButtonLabel}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              {columns
                .filter(col => visibleColumns.includes(col.key))
                .map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                  >
                    {col.label}
                  </th>
                ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => {
              const rowIndex = startIndex + idx;
              return (
                <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => handleSelectRow(rowIndex)}
                      className="rounded"
                    />
                  </td>
                  {columns
                    .filter(col => visibleColumns.includes(col.key))
                    .map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-sm text-gray-700"
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditClick(row)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400 text-white transition hover:bg-yellow-500"
                        aria-label="Editar"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(row)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white transition hover:bg-red-600"
                        aria-label="Eliminar"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {paginatedData.length > 0 ? startIndex + 1 : 0} a {Math.min(startIndex + itemsPerPage, safeData.length)} de {safeData.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
