import Table from '../forms/table';

const ADMIN_COLUMNS = [
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
    label: 'Administrador',
    isPrimary: true,
    mobileOrder: 0,
    searchValue: (row) => `${row?.name} ${row?.email} ${row?.role} ${row?.permissions}`,
    renderCell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{row?.name || 'Sin nombre'}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Rol: {row?.role || 'Sin rol'}</p>
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
    key: 'permissions',
    label: 'Permisos',
    mobileOrder: 2,
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'status',
    mobileOrder: 3,
  },
];

export default function AdminsTable(props) {
  return (
    <Table
      title="Administradores"
      subtitle="Gestiona cuentas administrativas y consulta rápidamente su nivel de acceso dentro del sistema."
      columns={ADMIN_COLUMNS}
      data={props.data || []}
      loading={props.loading}
      error={props.error}
      itemsPerPage={props.itemsPerPage || 8}
      filters={{
        searchPlaceholder: 'Buscar por administrador, correo, rol o permisos',
        statusField: 'status',
      }}
      emptyState={{
        title: 'No hay administradores disponibles',
        description: 'Cuando existan cuentas con roles administrativos se listarán aquí para su gestión.',
      }}
      actions={{
        edit: props.onEditClick ? { label: 'Editar administrador', onClick: props.onEditClick } : null,
        delete: props.onDeleteClick ? { label: 'Eliminar administrador', onClick: props.onDeleteClick } : null,
      }}
    />
  );
}
