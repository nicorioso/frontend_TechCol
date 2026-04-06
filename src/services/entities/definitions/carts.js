const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount);
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const getCustomerName = (cart) => {
  const firstName = cart?.customerName ?? cart?.customer_name ?? '';
  const lastName = cart?.customerLastName ?? cart?.customer_last_name ?? '';
  return `${firstName} ${lastName}`.trim() || cart?.customerEmail || 'N/A';
};

export const cartsEntity = {
  key: 'carts',
  singularLabel: 'Carrito',
  sourceKey: 'carts',
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
  map: (carts = []) =>
    carts.map((cart) => {
      const totalItems =
        Number(cart?.itemCount ?? cart?.itemsCount) ||
        (Array.isArray(cart?.items)
          ? cart.items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0)
          : 0);
      const subtotal = cart?.cartPrice ?? cart?.cart_price ?? 0;

      return {
        id: cart?.cartId ?? cart?.cart_id ?? cart?.id ?? '-',
        customer: getCustomerName(cart),
        items: totalItems,
        subtotal: formatCurrency(subtotal),
        status: totalItems > 0 ? 'Activo' : 'Vacío',
        createdAt: formatDate(cart?.createdAt ?? cart?.create_at ?? cart?.updatedAt),
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
