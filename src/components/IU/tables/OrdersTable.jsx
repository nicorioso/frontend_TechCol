import { useMemo } from 'react';
import Table from '../forms/table';

export default function OrdersTable(props) {
  const columns = useMemo(() => {
    if (props.data && props.data.length > 0) {
      return Object.keys(props.data[0])
        .filter(k => !String(k).toLowerCase().includes('password'))
        .map((key) => ({ key, label: key }));
    }
    return [
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
  }, [props.data]);

  return (
    <Table
      title="Pedidos"
      columns={columns}
      data={props.data || []}
      onEditClick={props.onEditClick}
      onDeleteClick={props.onDeleteClick}
      itemsPerPage={props.itemsPerPage || 10}
      {...props}
    />
  );
}
