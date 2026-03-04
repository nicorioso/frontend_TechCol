import { useMemo } from 'react';
import Table from '../forms/table';

export default function ProductsTable(props) {
  const columns = useMemo(() => {
    if (props.data && props.data.length > 0) {
      return Object.keys(props.data[0])
        .filter(k => !String(k).toLowerCase().includes('password'))
        .map((key) => ({ key, label: key }));
    }
    return [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre del producto' },
      { key: 'sku', label: 'SKU' },
      { key: 'category', label: 'Categoría' },
      { key: 'price', label: 'Precio' },
      { key: 'stock', label: 'Stock' },
      { key: 'status', label: 'Estado' },
    ];
  }, [props.data]);

  return (
    <Table
      title="Productos"
      columns={columns}
      data={props.data || []}
      onEditClick={props.onEditClick}
      onDeleteClick={props.onDeleteClick}
      itemsPerPage={props.itemsPerPage || 10}
      {...props}
    />
  );
}
