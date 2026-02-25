const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isNaN(amount) ? 0 : amount);
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US');
};

const getCustomerId = (customer) => customer?.customerId ?? customer?.customer_id ?? customer?.id;

const getCustomerName = (customer) => {
  const firstName = customer?.customerName ?? customer?.customer_name ?? customer?.name ?? '';
  const lastName = customer?.customerLastName ?? customer?.customer_last_name ?? '';
  return `${firstName} ${lastName}`.trim() || 'N/A';
};

export const cartsEntity = {
  key: 'carts',
  singularLabel: 'Carrito',
  sourceKey: 'customers',
  formFields: [
    { name: 'customer', label: 'Cliente', placeholder: 'Nombre del cliente' },
    { name: 'items', label: 'Items', type: 'number', placeholder: '0' },
    { name: 'subtotal', label: 'Subtotal', type: 'number', placeholder: '0.00' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Vacío', label: 'Vacío' },
      ],
    },
    { name: 'createdAt', label: 'Fecha de creación', type: 'date' },
  ],
  map: (customers = []) =>
    customers
      .filter((customer) => customer?.cart)
      .map((customer) => {
        const cart = customer.cart;
        const items = Array.isArray(cart?.items) ? cart.items : [];
        const totalItems = items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0);
        const subtotal =
          cart?.cart_price ??
          cart?.cartPrice ??
          items.reduce((sum, item) => sum + Number(item?.quantity ?? 0) * Number(item?.unit_price ?? 0), 0);

        return {
          id: cart?.cart_id ?? cart?.cartId ?? `CARRITO-${getCustomerId(customer)}`,
          customer: getCustomerName(customer),
          items: totalItems,
          subtotal: formatCurrency(subtotal),
          status: totalItems > 0 ? 'Activo' : 'Vacío',
          createdAt: formatDate(cart?.create_at ?? cart?.createdAt ?? cart?.updatedAt),
        };
      }),
  toFormValues: (row = {}) => ({
    customer: row.customer || '',
    items: row.items ?? '',
    subtotal: String(row.subtotal || '').replace(/[^\d.-]/g, ''),
    status: row.status || '',
    createdAt: row.createdAt || '',
  }),
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    customer: values.customer || '',
    items: Number(values.items || 0),
    subtotal: formatCurrency(values.subtotal),
    status: values.status || '',
    createdAt: values.createdAt || currentRow.createdAt,
  }),
};
