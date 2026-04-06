import Table from '../forms/table';

const ORDER_COLUMNS = [
  {
    key: 'id',
    label: 'Pedido',
    type: 'id',
    mobileOrder: 0,
  },
  {
    key: 'customer',
    label: 'Cliente',
    isPrimary: true,
    mobileOrder: 1,
    searchValue: (row) => `${row?.customer} ${row?.email} ${row?.paypalOrderId} ${row?.id}`,
    renderCell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{row?.customer || 'Sin cliente'}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{row?.email || 'Sin correo'}</p>
      </div>
    ),
  },
  {
    key: 'total',
    label: 'Total',
    align: 'right',
    mobileOrder: 2,
  },
  {
    key: 'itemCount',
    label: 'Items',
    align: 'right',
    mobileOrder: 3,
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'status',
    mobileOrder: 4,
  },
  {
    key: 'date',
    label: 'Fecha',
    mobileOrder: 5,
  },
  {
    key: 'paypalOrderId',
    label: 'Referencia PayPal',
    defaultHidden: true,
    mobile: false,
  },
  {
    key: 'customerId',
    label: 'ID cliente',
    type: 'id',
    searchable: false,
    defaultHidden: true,
    mobile: false,
  },
];

export default function OrdersTable(props) {
  return (
    <Table
      title="Pedidos"
      subtitle="Consulta las órdenes registradas, su estado operativo y los datos clave para seguimiento administrativo."
      columns={ORDER_COLUMNS}
      data={props.data || []}
      loading={props.loading}
      error={props.error}
      itemsPerPage={props.itemsPerPage || 8}
      filters={{
        searchPlaceholder: 'Buscar por pedido, cliente, correo o referencia PayPal',
        statusField: 'status',
      }}
      emptyState={{
        title: 'No hay pedidos registrados',
        description: 'Los pedidos confirmados o creados manualmente aparecerán aquí para su gestión.',
      }}
      actions={{
        create: props.onActionClick ? { label: props.actionButtonLabel || 'Crear nuevo', onClick: props.onActionClick } : null,
        edit: props.onEditClick ? { label: 'Editar pedido', onClick: props.onEditClick } : null,
        delete: props.onDeleteClick ? { label: 'Eliminar pedido', onClick: props.onDeleteClick } : null,
      }}
    />
  );
}
