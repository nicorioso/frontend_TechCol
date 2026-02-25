const getCustomerId = (customer) => customer?.customerId ?? customer?.customer_id ?? customer?.id;

const getCustomerName = (customer) => {
  const firstName = customer?.customerName ?? customer?.customer_name ?? customer?.name ?? '';
  const lastName = customer?.customerLastName ?? customer?.customer_last_name ?? '';
  return `${firstName} ${lastName}`.trim() || 'N/A';
};

export const customersEntity = {
  key: 'customers',
  singularLabel: 'Cliente',
  sourceKey: 'customers',
  formFields: [
    { name: 'customer_name', label: 'nombre_cliente', placeholder: 'Juan' },
    { name: 'customer_last_name', label: 'apellido_cliente', placeholder: 'Pérez' },
    { name: 'customer_email', label: 'correo_cliente', type: 'email', placeholder: 'juan@email.com' },
    { name: 'customer_password', label: 'contrasena_cliente', type: 'password', placeholder: '********', required: false },
    {
      name: 'customer_phone_number',
      label: 'telefono_cliente',
      type: 'phone',
      placeholder: '3001234567',
      countryName: 'customer_country',
      codeName: 'customer_country_code',
      defaultCountry: 'US',
      defaultCode: '+1',
    },
    {
      name: 'role_id',
      label: 'rol_id',
      defaultValue: 'cliente',
      disabled: true,
    },
  ],
  map: (customers = []) =>
    customers.map((customer) => ({
      id: getCustomerId(customer) ?? '-',
      name: getCustomerName(customer),
      email: customer?.customerEmail ?? customer?.customer_email ?? customer?.email ?? '-',
      phone: customer?.customerPhoneNumber ?? customer?.customer_phone_number ?? customer?.phone ?? '-',
      country: customer?.country ?? customer?.address?.country ?? '-',
      status: customer?.enabled === false || customer?.active === false ? 'Inactivo' : 'Activo',
    })),
  create: async (values, { customerService }) => {
    const payload = {
      customerName: values.customer_name,
      customerLastName: values.customer_last_name,
      customerEmail: values.customer_email,
      customerPassword: values.customer_password,
      customerPhoneNumber: `${values.customer_country_code || ''} ${values.customer_phone_number || ''}`.trim(),
    };

    return customerService.register(payload);
  },
  toFormValues: (row = {}) => {
    const fullName = String(row.name || '').trim();
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const phoneRaw = String(row.phone || '').trim();
    const phoneParts = phoneRaw.split(' ');
    const hasCode = phoneParts.length > 1 && phoneParts[0].startsWith('+');
    const code = hasCode ? phoneParts[0] : '+1';
    const phoneNumber = hasCode ? phoneParts.slice(1).join(' ') : phoneRaw;

    return {
      customer_name: firstName || '',
      customer_last_name: lastName || '',
      customer_email: row.email || '',
      customer_password: '',
      customer_phone_number: phoneNumber || '',
      customer_country_code: code,
      customer_country: 'US',
      role_id: 'cliente',
    };
  },
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    name: `${values.customer_name || ''} ${values.customer_last_name || ''}`.trim(),
    email: values.customer_email || '',
    phone: `${values.customer_country_code || ''} ${values.customer_phone_number || ''}`.trim(),
  }),
};
