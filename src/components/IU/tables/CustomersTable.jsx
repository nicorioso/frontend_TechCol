import Table from '../forms/table';

const CUSTOMER_COLUMNS = [
  {
    key: 'id',
    label: 'ID',
    type: 'id',
    searchable: false,
    defaultHidden: true,
    mobile: false,
  },
  {
    key: 'name',
    label: 'Cliente',
    isPrimary: true,
    mobileOrder: 0,
    searchValue: (row) => `${row?.name} ${row?.email} ${row?.phone} ${row?.country}`,
    renderCell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{row?.name || 'Sin nombre'}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ID #{row?.id ?? '-'}</p>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Correo',
    type: 'email',
    mobileOrder: 1,
  },
  {
    key: 'phone',
    label: 'Telefono',
    mobileOrder: 2,
  },
  {
    key: 'country',
    label: 'Pais',
    mobileOrder: 3,
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'status',
    mobileOrder: 4,
  },
];

export default function CustomersTable(props) {
  return (
    <Table
      title="Clientes"
      subtitle="Administra perfiles, revisa su estado actual y mantén la información principal siempre accesible."
      columns={CUSTOMER_COLUMNS}
      data={props.data || []}
      loading={props.loading}
      error={props.error}
      itemsPerPage={props.itemsPerPage || 8}
      filters={{
        searchPlaceholder: 'Buscar por cliente, correo, telefono o pais',
        statusField: 'status',
      }}
      emptyState={{
        title: 'Aun no hay clientes registrados',
        description: 'Los clientes creados desde autenticacion o desde el panel apareceran aqui automaticamente.',
      }}
      actions={{
        create: props.onActionClick ? { label: props.actionButtonLabel || 'Crear nuevo', onClick: props.onActionClick } : null,
        edit: props.onEditClick ? { label: 'Editar cliente', onClick: props.onEditClick } : null,
        delete: props.onDeleteClick ? { label: 'Eliminar cliente', onClick: props.onDeleteClick } : null,
      }}
    />
  );
}
