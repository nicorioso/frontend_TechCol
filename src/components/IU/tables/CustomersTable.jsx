import Table from '../forms/table';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'country', label: 'País' },
  { key: 'status', label: 'Estado' },
];

export default function CustomersTable(props) {
  return (
    <Table
      title="Clientes"
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
