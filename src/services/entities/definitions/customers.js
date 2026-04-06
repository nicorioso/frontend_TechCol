import CustomerService from '../../customer/CustomerService';
import { normalizePhoneToE164, splitE164Phone } from '../../../utils/phone';

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
    { name: 'customer_last_name', label: 'apellido_cliente', placeholder: 'Perez' },
    { name: 'customer_email', label: 'correo_cliente', type: 'email', placeholder: 'juan@email.com' },
    {
      name: 'customer_password',
      label: 'contrasena_cliente',
      type: 'password',
      placeholder: '********',
      required: false,
      hideOnEdit: true,
    },
    {
      name: 'customer_phone_number',
      label: 'telefono_cliente',
      type: 'phone',
      placeholder: '3001234567',
      countryName: 'customer_country',
      codeName: 'customer_country_code',
      defaultCountry: 'CO',
      defaultCode: '+57',
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
    const rawPhone = `${values.customer_country_code || ''}${values.customer_phone_number || ''}`.trim();
    const customerPhoneNumber = normalizePhoneToE164(
      rawPhone,
      { defaultCountryCode: '+57' }
    );
    if (rawPhone && !customerPhoneNumber) {
      throw new Error('Telefono invalido. Usa formato internacional E.164, ejemplo +573001234567.');
    }

    const payload = {
      customerName: values.customer_name,
      customerLastName: values.customer_last_name,
      customerEmail: values.customer_email,
      customerPassword: values.customer_password,
      customerPhoneNumber,
    };

    return customerService.register(payload);
  },
  update: async (id, values = {}) => {
    const rawPhone = `${values.customer_country_code || ''}${values.customer_phone_number || ''}`.trim();
    const customerPhoneNumber = normalizePhoneToE164(
      rawPhone,
      { defaultCountryCode: '+57' }
    );
    if (rawPhone && !customerPhoneNumber) {
      throw new Error('Telefono invalido. Usa formato internacional E.164, ejemplo +573001234567.');
    }

    const payload = {
      customerName: values.customer_name,
      customerLastName: values.customer_last_name,
      customerEmail: values.customer_email,
      customerPhoneNumber,
    };

    if (values.customer_password) {
      payload.customerPassword = values.customer_password;
    }

    return CustomerService.patch(id, payload);
  },
  delete: async (id) => CustomerService.delete(id),
  toFormValues: (row = {}) => {
    const fullName = String(row.name || '').trim();
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    const phoneInfo = splitE164Phone(String(row.phone || '').trim(), { defaultCountryCode: '+57' });

    return {
      customer_name: firstName || '',
      customer_last_name: lastName || '',
      customer_email: row.email || '',
      customer_password: '',
      customer_phone_number: phoneInfo.nationalNumber || '',
      customer_country_code: phoneInfo.code,
      customer_country: 'CO',
      role_id: 'cliente',
    };
  },
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    name: `${values.customer_name || ''} ${values.customer_last_name || ''}`.trim(),
    email: values.customer_email || '',
    phone:
      normalizePhoneToE164(`${values.customer_country_code || ''}${values.customer_phone_number || ''}`, {
        defaultCountryCode: '+57',
      }) || '',
  }),
};
