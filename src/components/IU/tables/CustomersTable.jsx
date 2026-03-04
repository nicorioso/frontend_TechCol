import { useMemo } from 'react';
import Table from '../forms/table';

export default function CustomersTable(props) {
  const columns = useMemo(() => {
    if (props.data && props.data.length > 0) {
      // derive columns from first row keys, excluding sensitive fields
      return Object.keys(props.data[0])
        .filter((k) => k !== 'customer_password')
        .map((key) => ({ key, label: key }));
    }
    // fall back to previous hard‑coded list
    return [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre' },
      { key: 'email', label: 'Correo' },
      { key: 'phone', label: 'Teléfono' },
      { key: 'country', label: 'País' },
      { key: 'status', label: 'Estado' },
    ];
  }, [props.data]);

  return (
    <Table
      title="Clientes"
      columns={columns}
      hiddenColumns={["customer_password"]}
      data={props.data || []}
      onEditClick={props.onEditClick}
      onDeleteClick={props.onDeleteClick}
      itemsPerPage={props.itemsPerPage || 10}
      {...props}
    />
  );
}
