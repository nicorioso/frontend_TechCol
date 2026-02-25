import Table from '../forms/table';

const columns = [
  { key: 'id', label: 'ID del pedido' },
  { key: 'shopifyId', label: 'Shopify #' },
  { key: 'date', label: 'Fecha' },
  { key: 'status', label: 'Estado' },
  { key: 'customer', label: 'Cliente' },
  { key: 'email', label: 'Correo' },
  { key: 'country', label: 'País' },
  { key: 'shipping', label: 'Envío' },
  { key: 'source', label: 'Origen' },
  { key: 'orderType', label: 'Tipo de pedido' },
];

export default function OrdersTable(props) {
  return (
    <Table
      title="Pedidos"
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
