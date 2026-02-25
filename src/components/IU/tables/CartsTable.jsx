import Table from '../forms/table';

const columns = [
  { key: 'id', label: 'ID del carrito' },
  { key: 'customer', label: 'Cliente' },
  { key: 'items', label: 'Items' },
  { key: 'subtotal', label: 'Subtotal' },
  { key: 'status', label: 'Estado' },
  { key: 'createdAt', label: 'Creado' },
];

export default function CartsTable(props) {
  return (
    <Table
      title="Carritos de compra"
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
