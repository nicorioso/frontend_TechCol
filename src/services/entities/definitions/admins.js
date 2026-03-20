import CustomerService from '../../customer/CustomerService';

const getCustomerId = (customer) => customer?.customerId ?? customer?.customer_id ?? customer?.id;

const getCustomerName = (customer) => {
  const firstName = customer?.customerName ?? customer?.customer_name ?? customer?.name ?? '';
  const lastName = customer?.customerLastName ?? customer?.customer_last_name ?? '';
  return `${firstName} ${lastName}`.trim() || 'N/A';
};

const getRoleName = (customer) => {
  const role = customer?.role;
  if (typeof role === 'string') return role;
  return role?.name ?? role?.roleName ?? role?.role_name ?? customer?.roleName ?? 'CLIENTE';
};

export const adminsEntity = {
  key: 'admins',
  singularLabel: 'Administrador',
  sourceKey: 'customers',
  formFields: [
    { name: 'name', label: 'Nombre', placeholder: 'Nombre del administrador' },
    { name: 'email', label: 'Correo', type: 'email', placeholder: 'admin@email.com' },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      disabled: true,
      options: [
        { value: 'ROLE_ADMIN', label: 'ROLE_ADMIN' },
        { value: 'ROLE_SUPER_ADMIN', label: 'ROLE_SUPER_ADMIN' },
      ],
    },
    { name: 'permissions', label: 'Permisos', placeholder: 'Acceso total' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
      ],
    },
  ],
  map: (customers = []) =>
    customers
      .filter((customer) => String(getRoleName(customer)).toUpperCase().includes('ADMIN'))
      .map((customer) => ({
        id: getCustomerId(customer) ?? '-',
        name: getCustomerName(customer),
        email: customer?.customerEmail ?? customer?.customer_email ?? customer?.email ?? '-',
        role: getRoleName(customer),
        permissions: 'Acceso total',
        status: customer?.enabled === false || customer?.active === false ? 'Inactivo' : 'Activo',
      })),
  update: async (id, values = {}) => {
    const fullName = String(values.name || '').trim();
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    const payload = {
      customerName: firstName || fullName,
      customerLastName: lastName,
      customerEmail: values.email || '',
    };

    try {
      return await CustomerService.patch(id, payload);
    } catch (error) {
      if (error?.response?.status !== 404) {
        throw error;
      }

      const existingCustomer = await CustomerService.getById(id);
      const fallbackPayload = {
        ...existingCustomer,
        customerId: existingCustomer?.customerId ?? id,
        customerName: payload.customerName,
        customerLastName: payload.customerLastName,
        customerEmail: payload.customerEmail,
      };

      const response = await CustomerService.api.put('/customers', fallbackPayload);
      return response.data;
    }
  },
  delete: async (id) => CustomerService.delete(id),
  toFormValues: (row = {}) => ({
    name: row.name || '',
    email: row.email || '',
    role: row.role || '',
    permissions: row.permissions || '',
    status: row.status || '',
  }),
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    name: values.name || '',
    email: values.email || '',
    role: values.role || '',
    permissions: values.permissions || '',
    status: values.status || '',
  }),
};
