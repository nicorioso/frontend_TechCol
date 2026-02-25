import Table from '../forms/table';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'role', label: 'Rol' },
  { key: 'permissions', label: 'Permisos' },
  { key: 'status', label: 'Estado' },
];

export default function AdminsTable(props) {
  return (
    <Table
      title="Administradores"
      columns={columns}
      data={props.data || []}
      actionButtonLabel="DESPACHAR SELECCIONADOS"
      onActionClick={props.onActionClick}
      onEditClick={props.onEditClick}
      onDeleteClick={props.onDeleteClick}
      itemsPerPage={props.itemsPerPage || 10}
    />
  );
}
