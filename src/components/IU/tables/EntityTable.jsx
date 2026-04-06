import { Fragment, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Columns3,
  Filter,
  Grid2x2,
  Inbox,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import useClickOutside from '../../../hooks/useClickOutside';
import useEntityTableState from '../../../hooks/entities/useEntityTableState';

const normalizeStatusToken = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();

const STATUS_STYLES = {
  ACTIVO:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/20 dark:text-emerald-300',
  ACTIVE:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/20 dark:text-emerald-300',
  EN_STOCK:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/20 dark:text-emerald-300',
  PENDIENTE:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-900/20 dark:text-amber-300',
  PROCESANDO:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-900/20 dark:text-amber-300',
  PAID:
    'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-900/20 dark:text-cyan-300',
  PAGADO:
    'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-900/20 dark:text-cyan-300',
  DELIVERED:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/20 dark:text-emerald-300',
  ENTREGADO:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/20 dark:text-emerald-300',
  INACTIVO:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-900/20 dark:text-rose-300',
  INACTIVE:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-900/20 dark:text-rose-300',
  AGOTADO:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-900/20 dark:text-rose-300',
  CANCELLED:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-900/20 dark:text-rose-300',
  CANCELADO:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-900/20 dark:text-rose-300',
  VACIO:
    'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const getStatusBadgeClassName = (value) => {
  const statusToken = normalizeStatusToken(value).replace(/\s+/g, '_');
  return STATUS_STYLES[statusToken] ||
    'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
};

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sortedPages = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const result = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      result.push(`ellipsis-${page}`);
    }
    result.push(page);
  });

  return result;
};

const getRowKey = (row, fallback) => row?.id ?? row?.key ?? `row-${fallback}`;

const getRawValue = (column, row) => row?.[column.key];

function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClassName(value)}`}
    >
      {String(value ?? 'Sin estado')}
    </span>
  );
}

function ActionIconButton({ label, tone, icon: Icon, onClick }) {
  const toneClasses =
    tone === 'danger'
      ? 'border-rose-500/70 bg-transparent text-rose-400 hover:bg-rose-500/10 dark:border-rose-500/70 dark:text-rose-400 dark:hover:bg-rose-500/10'
      : 'border-amber-500/70 bg-transparent text-amber-400 hover:bg-amber-500/10 dark:border-amber-500/70 dark:text-amber-400 dark:hover:bg-amber-500/10';

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border shadow-md shadow-slate-950/10 transition duration-200 ${toneClasses}`}
    >
      <Icon className="h-4 w-4" />
      <span className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded-lg bg-slate-950 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        {label}
      </span>
    </button>
  );
}

function EntityTableSkeleton({ showActions }) {
  const skeletonRows = Array.from({ length: 6 }, (_, index) => index);

  return (
    <>
      <div className="hidden md:block">
        <div className="max-h-[560px] overflow-auto px-6 pb-6">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur dark:bg-slate-900/95">
              <tr>
                {Array.from({ length: 5 }, (_, index) => (
                  <th key={index} className="px-4 py-3 text-left">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  </th>
                ))}
                {showActions ? (
                  <th className="px-4 py-3 text-right">
                    <div className="ml-auto h-3 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((row) => (
                <tr key={row}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <td key={index} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-800" />
                    </td>
                  ))}
                  {showActions ? (
                    <td className="px-4 py-4">
                      <div className="ml-auto flex justify-end gap-2">
                        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4 md:hidden">
        {skeletonRows.slice(0, 4).map((row) => (
          <div
            key={row}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="space-y-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/80">
                  <div className="h-3 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TableMessageState({ icon: Icon, title, description, action }) {
  return (
    <div className="px-6 py-10">
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/90 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
        <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

function renderCellContent(column, row, variant = 'table') {
  const value = getRawValue(column, row);

  if (typeof column.renderCell === 'function') {
    return column.renderCell({ row, value, variant });
  }

  if (column.type === 'image' && value) {
    return (
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <img
          src={value}
          alt={column.label}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (column.type === 'status' || column.key === 'status') {
    return <StatusBadge value={value} />;
  }

  if (column.type === 'email' && value) {
    return (
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {value}
      </span>
    );
  }

  if (column.type === 'id') {
    return (
      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {String(value ?? '-')}
      </span>
    );
  }

  return <span>{value == null || value === '' ? '-' : String(value)}</span>;
}

export default function EntityTable({
  title = 'Entidad',
  subtitle = 'Gestiona la información y acciones principales desde una sola vista.',
  data = [],
  columns = [],
  itemsPerPage = 8,
  loading = false,
  error = '',
  actions = {},
  filters = {},
  emptyState = {},
}) {
  const {
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
  } = useEntityTableState({
    columns,
    data,
    filters,
    itemsPerPage,
  });
  const createAction = actions?.create;
  const editAction = actions?.edit;
  const deleteAction = actions?.delete;
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const columnMenuRef = useRef(null);

  useClickOutside(columnMenuRef, isColumnMenuOpen, () => setIsColumnMenuOpen(false));

  const hasRowActions = Boolean(editAction?.onClick || deleteAction?.onClick);
  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);
  const primaryMobileColumn = mobileColumns.find((column) => column.isPrimary) || mobileColumns[0];
  const mobileDetailColumns = mobileColumns
    .filter((column) => column.key !== primaryMobileColumn?.key && !column.isPrimary && column.key !== 'status')
    .slice(0, 4);

  const renderPrimaryActionButton = () =>
    createAction?.onClick ? (
      <button
        type="button"
        onClick={createAction.onClick}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition duration-200 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
      >
        <Plus className="h-4 w-4" />
        {createAction.label || 'Crear nuevo'}
      </button>
    ) : null;

  const showNoResults = !loading && !error && filteredRows.length === 0 && data.length > 0;
  const showEmptyState = !loading && !error && data.length === 0;

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] px-6 py-5 dark:border-slate-700/80 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.92))]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Grid2x2 className="h-4 w-4" />
              Gestion de entidades
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="mt-1.5 max-w-xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200/80 px-6 py-4 dark:border-slate-700/80">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative w-full xl:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={filters.searchPlaceholder || `Buscar en ${title.toLowerCase()}`}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-10 text-sm text-slate-700 shadow-md shadow-slate-950/5 outline-none transition duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:bg-slate-900"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition duration-200 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          {statusOptions.length > 0 ? (
            <label className="relative w-full xl:w-60">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-9 text-sm text-slate-700 shadow-md shadow-slate-950/5 outline-none transition duration-200 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-cyan-500 dark:focus:bg-slate-900"
              >
                <option value="all">Todos los estados</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : <div />}

          <div className="flex flex-wrap items-center gap-3 xl:ml-auto xl:justify-end">
            <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 shadow-md shadow-slate-950/5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredRows.length} resultado{filteredRows.length === 1 ? '' : 's'}
            </span>

            <div className="relative" ref={columnMenuRef}>
              <button
                type="button"
                onClick={() => setIsColumnMenuOpen((previous) => !previous)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-md shadow-slate-950/5 transition duration-200 hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/20"
              >
                <Columns3 className="h-4 w-4" />
                Columnas
              </button>

              {isColumnMenuOpen ? (
                <div className="absolute right-0 top-full z-20 mt-2 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {columns.map((column) => (
                    <label
                      key={column.key}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumnKeys.includes(column.key)}
                        onChange={() => toggleColumnVisibility(column.key)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span>{column.label}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>

            {renderPrimaryActionButton()}
          </div>
        </div>
      </div>

      {loading ? (
        <EntityTableSkeleton showActions={hasRowActions} />
      ) : error ? (
        <TableMessageState
          icon={CircleAlert}
          title="No fue posible cargar esta entidad"
          description={error}
        />
      ) : showEmptyState ? (
        <TableMessageState
          icon={Inbox}
          title={emptyState.title || `Aun no hay ${title.toLowerCase()}`}
          description={
            emptyState.description ||
            'Cuando existan registros disponibles, se mostraran aqui con filtros y acciones rapidas.'
          }
          action={renderPrimaryActionButton()}
        />
      ) : showNoResults ? (
        <TableMessageState
          icon={Search}
          title="No hay coincidencias con los filtros actuales"
          description="Prueba con otra búsqueda o limpia los filtros para volver a ver todos los registros."
          action={
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-md shadow-slate-950/5 transition duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <div className="max-h-[560px] overflow-auto px-6">
              <table className="w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur dark:bg-slate-900/95">
                  <tr>
                    {visibleColumns.map((column) => (
                      <th
                        key={column.key}
                        className={`border-b border-slate-200 px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:text-slate-400 ${
                          column.align === 'right' ? 'text-right' : ''
                        }`}
                      >
                        {column.label}
                      </th>
                    ))}
                    {hasRowActions ? (
                      <th className="border-b border-slate-200 px-4 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        Acciones
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row, index) => (
                    <tr
                      key={getRowKey(row, index)}
                      className="group transition duration-200 hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {visibleColumns.map((column) => (
                        <td
                          key={column.key}
                          className={`border-b border-slate-100 px-4 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200 ${
                            column.align === 'right' ? 'text-right' : ''
                          }`}
                        >
                          {renderCellContent(column, row)}
                        </td>
                      ))}
                      {hasRowActions ? (
                        <td className="border-b border-slate-100 px-4 py-4 dark:border-slate-800">
                          <div className="flex items-center justify-end gap-2">
                            {editAction?.onClick ? (
                              <ActionIconButton
                                label={editAction.label || 'Editar'}
                                tone="warning"
                                icon={Pencil}
                                onClick={() => editAction.onClick(row)}
                              />
                            ) : null}
                            {deleteAction?.onClick ? (
                              <ActionIconButton
                                label={deleteAction.label || 'Eliminar'}
                                tone="danger"
                                icon={Trash2}
                                onClick={() => deleteAction.onClick(row)}
                              />
                            ) : null}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4 md:hidden">
            {paginatedRows.map((row, index) => (
              <div
                key={getRowKey(row, index)}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                      {primaryMobileColumn ? renderCellContent(primaryMobileColumn, row, 'mobile') : 'Registro'}
                    </div>
                    {row?.id != null ? (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ID: {row.id}</p>
                    ) : null}
                  </div>
                  {row?.status ? <StatusBadge value={row.status} /> : null}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {mobileDetailColumns.map((column) => (
                    <div
                      key={column.key}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/80"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        {column.label}
                      </p>
                      <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                        {renderCellContent(column, row, 'mobile')}
                      </div>
                    </div>
                  ))}
                </div>

                {hasRowActions ? (
                  <div className="mt-4 flex items-center justify-end gap-2">
                    {editAction?.onClick ? (
                      <ActionIconButton
                        label={editAction.label || 'Editar'}
                        tone="warning"
                        icon={Pencil}
                        onClick={() => editAction.onClick(row)}
                      />
                    ) : null}
                    {deleteAction?.onClick ? (
                      <ActionIconButton
                        label={deleteAction.label || 'Eliminar'}
                        tone="danger"
                        icon={Trash2}
                        onClick={() => deleteAction.onClick(row)}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pagina {currentPage} de {totalPages}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>

                  {pageNumbers.map((page) =>
                    String(page).startsWith('ellipsis-') ? (
                      <Fragment key={page}>
                        <span className="px-1 text-slate-400">...</span>
                      </Fragment>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] rounded-xl px-3 py-2 text-sm font-semibold transition ${
                          currentPage === page
                            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
