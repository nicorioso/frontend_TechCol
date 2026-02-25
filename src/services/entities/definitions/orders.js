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

export const ordersEntity = {
  key: 'orders',
  singularLabel: 'Pedido',
  sourceKey: 'customers',
  formFields: [
    { name: 'shopifyId', label: 'Shopify #', placeholder: '17713' },
    { name: 'date', label: 'Fecha', type: 'date' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'Procesando', label: 'Procesando' },
        { value: 'Completado', label: 'Completado' },
      ],
    },
    { name: 'customer', label: 'Cliente', placeholder: 'Nombre del cliente' },
    { name: 'email', label: 'Correo', type: 'email', placeholder: 'cliente@email.com' },
    { name: 'country', label: 'País', placeholder: 'Estados Unidos' },
    { name: 'shipping', label: 'Envío', type: 'number', placeholder: '0.00' },
    { name: 'source', label: 'Origen', placeholder: 'Web' },
    { name: 'orderType', label: 'Tipo de pedido', placeholder: 'Cliente' },
  ],
  map: (customers = []) =>
    customers
      .filter((customer) => customer?.cart)
      .map((customer) => {
        const cart = customer.cart;
        const cartId = cart?.cart_id ?? cart?.cartId ?? getCustomerId(customer);
        const total = Number(cart?.cart_price ?? cart?.cartPrice ?? 0);

        return {
          id: `PED-${cartId}`,
          shopifyId: '-',
          date: formatDate(cart?.updatedAt ?? cart?.create_at ?? cart?.createdAt),
          status: total > 0 ? 'Procesando' : 'Borrador',
          customer: getCustomerName(customer),
          email: customer?.customerEmail ?? customer?.customer_email ?? customer?.email ?? '-',
          country: customer?.country ?? customer?.address?.country ?? '-',
          shipping: formatCurrency(0),
          source: 'Web',
          orderType: 'Carrito',
        };
      }),
  toFormValues: (row = {}) => ({
    shopifyId: row.shopifyId || '',
    date: row.date || '',
    status: row.status || '',
    customer: row.customer || '',
    email: row.email || '',
    country: row.country || '',
    shipping: String(row.shipping || '').replace(/[^\d.-]/g, ''),
    source: row.source || '',
    orderType: row.orderType || '',
  }),
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    shopifyId: values.shopifyId || '',
    date: values.date || currentRow.date,
    status: values.status || '',
    customer: values.customer || '',
    email: values.email || '',
    country: values.country || '',
    shipping: formatCurrency(values.shipping),
    source: values.source || '',
    orderType: values.orderType || '',
  }),
};
