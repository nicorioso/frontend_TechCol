import Table from '../forms/table';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre del producto' },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Categoría' },
  { key: 'price', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Estado' },
];

export default function ProductsTable(props) {
  return (
    <Table
      title="Productos"
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
