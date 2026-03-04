import { useMemo } from 'react';
import Table from '../forms/table';

export default function AdminsTable(props) {
  const columns = useMemo(() => {
    if (props.data && props.data.length > 0) {
      // filter out any password field
      return Object.keys(props.data[0])
        .filter(k => !String(k).toLowerCase().includes('password'))
        .map((key) => ({ key, label: key }));
    }
    return [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre' },
      { key: 'email', label: 'Correo' },
      { key: 'role', label: 'Rol' },
      { key: 'permissions', label: 'Permisos' },
      { key: 'status', label: 'Estado' },
    ];
  }, [props.data]);

  return (
    <Table
      title="Administradores"
      columns={columns}
      data={props.data || []}
      onEditClick={props.onEditClick}
      onDeleteClick={props.onDeleteClick}
      itemsPerPage={props.itemsPerPage || 10}
      {...props}
    />
  );
}
