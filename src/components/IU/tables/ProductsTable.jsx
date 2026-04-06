import Table from '../forms/table';

const PRODUCT_COLUMNS = [
  {
    key: 'image',
    label: 'Imagen',
    type: 'image',
    searchable: false,
    mobile: false,
  },
  {
    key: 'name',
    label: 'Producto',
    isPrimary: true,
    mobileOrder: 0,
    searchValue: (row) => `${row?.name} ${row?.sku} ${row?.category}`,
    renderCell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{row?.name || 'Producto sin nombre'}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {row?.category || 'Sin categoria'} • {row?.sku || 'Sin SKU'}
        </p>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'Precio',
    align: 'right',
    mobileOrder: 1,
  },
  {
    key: 'stock',
    label: 'Stock',
    align: 'right',
    mobileOrder: 2,
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'status',
    mobileOrder: 3,
  },
];

export default function ProductsTable(props) {
  return (
    <Table
      title="Productos"
      subtitle="Controla el catálogo, revisa disponibilidad y mantén visibles los datos más importantes de inventario."
      columns={PRODUCT_COLUMNS}
      data={props.data || []}
      loading={props.loading}
      error={props.error}
      itemsPerPage={props.itemsPerPage || 8}
      filters={{
        searchPlaceholder: 'Buscar por producto, SKU o categoria',
        statusField: 'status',
      }}
      emptyState={{
        title: 'Todavia no hay productos cargados',
        description: 'Agrega productos al catálogo para comenzar a gestionarlos desde este dashboard.',
      }}
      actions={{
        create: props.onActionClick ? { label: props.actionButtonLabel || 'Crear nuevo', onClick: props.onActionClick } : null,
        edit: props.onEditClick ? { label: 'Editar producto', onClick: props.onEditClick } : null,
        delete: props.onDeleteClick ? { label: 'Eliminar producto', onClick: props.onDeleteClick } : null,
      }}
    />
  );
}
