import Table from '../forms/table';

const CART_COLUMNS = [
  {
    key: 'id',
    label: 'ID',
    type: 'id',
    searchable: false,
    defaultHidden: true,
    mobile: false,
  },
  {
    key: 'customer',
    label: 'Cliente',
    isPrimary: true,
    mobileOrder: 0,
    searchValue: (row) => `${row?.customer} ${row?.id}`,
    renderCell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{row?.customer || 'Sin cliente'}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Carrito #{row?.id ?? '-'}</p>
      </div>
    ),
  },
  {
    key: 'items',
    label: 'Items',
    align: 'right',
    mobileOrder: 1,
  },
  {
    key: 'subtotal',
    label: 'Subtotal',
    align: 'right',
    mobileOrder: 2,
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'status',
    mobileOrder: 3,
  },
  {
    key: 'createdAt',
    label: 'Creado',
    mobileOrder: 4,
  },
];

export default function CartsTable(props) {
  return (
    <Table
      title="Carritos"
      subtitle="Supervisa la actividad de compra en curso y detecta carritos activos o vacíos de forma rápida."
      columns={CART_COLUMNS}
      data={props.data || []}
      loading={props.loading}
      error={props.error}
      itemsPerPage={props.itemsPerPage || 8}
      filters={{
        searchPlaceholder: 'Buscar por cliente o identificador de carrito',
        statusField: 'status',
      }}
      emptyState={{
        title: 'No hay carritos para mostrar',
        description: 'Cuando existan carritos asociados a clientes aparecerán aquí con su estado actual.',
      }}
      actions={{
        edit: props.onEditClick ? { label: 'Editar carrito', onClick: props.onEditClick } : null,
        delete: props.onDeleteClick ? { label: 'Eliminar carrito', onClick: props.onDeleteClick } : null,
      }}
    />
  );
}
