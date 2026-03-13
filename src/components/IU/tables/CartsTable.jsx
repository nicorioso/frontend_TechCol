import { useMemo } from 'react';
import Table from '../forms/table';

export default function CartsTable(props) {
  const columns = useMemo(() => {
    if (props.data && props.data.length > 0) {
      return Object.keys(props.data[0])
        .filter(k => !String(k).toLowerCase().includes('password'))
        .map((key) => ({ key, label: key }));
    }
    return [
      { key: 'id', label: 'ID del carrito' },
      { key: 'customer', label: 'Cliente' },
      { key: 'items', label: 'Items' },
      { key: 'subtotal', label: 'Subtotal' },
      { key: 'status', label: 'Estado' },
      { key: 'createdAt', label: 'Creado' },
    ];
  }, [props.data]);

  return (
    <Table
      title="Carritos de compra"
      columns={columns}
      data={props.data || []}
      onEditClick={props.onEditClick}
      onDeleteClick={props.onDeleteClick}
      itemsPerPage={props.itemsPerPage || 10}
      {...props}
    />
  );
}
