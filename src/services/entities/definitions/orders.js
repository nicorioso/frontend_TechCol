import orderService from '../../order/orderService';

const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

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

const parseNumber = (value) => {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? 0 : amount;
};

const toDateTimeInputValue = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized) return '';
  return normalized.replace(' ', 'T').slice(0, 16);
};

const toDateTimePayload = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  return normalized.length === 16 ? `${normalized}:00` : normalized;
};

const getCustomerId = (customer) => customer?.customerId ?? customer?.customer_id ?? customer?.id;

const getCustomerName = (customer) => {
  const firstName = customer?.customerName ?? customer?.customer_name ?? customer?.name ?? '';
  const lastName = customer?.customerLastName ?? customer?.customer_last_name ?? '';
  return `${firstName} ${lastName}`.trim() || 'N/A';
};

const getStatusLabel = (status) => {
  const normalized = String(status ?? '').trim().toUpperCase();
  return ORDER_STATUS_OPTIONS.find((option) => option.value === normalized)?.label || normalized || 'Sin estado';
};

const mapOrder = (order = {}) => {
  const customer = order?.customer ?? {};
  const details = Array.isArray(order?.orderDetails) ? order.orderDetails : [];
  const statusValue = String(order?.status ?? '').trim().toUpperCase();

  return {
    id: order?.orderId ?? order?.order_id ?? order?.id ?? '-',
    customerId: getCustomerId(customer) ?? '',
    customer: getCustomerName(customer),
    email: customer?.customerEmail ?? customer?.customer_email ?? customer?.email ?? '-',
    total: formatCurrency(order?.orderPrice),
    status: getStatusLabel(statusValue),
    itemCount: details.reduce((sum, detail) => sum + Number(detail?.quantity ?? 0), 0),
    date: formatDate(order?.orderDate ?? order?.createdAt),
    paypalOrderId: order?.paypalOrderId ?? '-',
    orderPriceValue: String(order?.orderPrice ?? ''),
    orderDateInput: toDateTimeInputValue(order?.orderDate ?? order?.createdAt),
    statusValue,
  };
};

export const ordersEntity = {
  key: 'orders',
  singularLabel: 'Pedido',
  sourceKey: 'orders',
  formFields: [
    {
      name: 'customerId',
      label: 'ID del cliente',
      type: 'number',
      placeholder: '1',
      helperText: 'Identificador del cliente propietario del pedido.',
    },
    {
      name: 'orderPrice',
      label: 'Total del pedido',
      type: 'number',
      placeholder: '250000',
      helperText: 'Valor total registrado para este pedido.',
    },
    {
      name: 'orderDate',
      label: 'Fecha del pedido',
      type: 'datetime-local',
      helperText: 'Fecha y hora asociadas al pedido.',
    },
    {
      name: 'paypalOrderId',
      label: 'Referencia PayPal',
      placeholder: 'PAY-123456',
      required: false,
      helperText: 'Opcional para pedidos creados manualmente.',
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: ORDER_STATUS_OPTIONS,
    },
  ],
  map: (orders = []) => orders.map(mapOrder),
  create: async (values = {}) => {
    return orderService.createOrder({
      customerId: Number(values.customerId),
      orderPrice: parseNumber(values.orderPrice),
      orderDate: toDateTimePayload(values.orderDate),
      paypalOrderId: String(values.paypalOrderId ?? '').trim(),
      status: String(values.status ?? '').trim().toUpperCase(),
    });
  },
  update: async (id, values = {}) => {
    return orderService.updateOrder(id, {
      customerId: Number(values.customerId),
      orderPrice: parseNumber(values.orderPrice),
      orderDate: toDateTimePayload(values.orderDate),
      paypalOrderId: String(values.paypalOrderId ?? '').trim(),
      status: String(values.status ?? '').trim().toUpperCase(),
    });
  },
  delete: async (id) => orderService.deleteOrder(id),
  toFormValues: (row = {}) => ({
    customerId: row.customerId ?? '',
    orderPrice: String(row.orderPriceValue ?? '').replace(/[^\d.-]/g, ''),
    orderDate: row.orderDateInput || '',
    paypalOrderId: row.paypalOrderId && row.paypalOrderId !== '-' ? row.paypalOrderId : '',
    status: row.statusValue || '',
  }),
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    customerId: Number(values.customerId || currentRow.customerId || 0),
    total: formatCurrency(values.orderPrice),
    status: getStatusLabel(values.status),
    date: formatDate(values.orderDate),
    paypalOrderId: values.paypalOrderId || '-',
    orderPriceValue: String(values.orderPrice ?? currentRow.orderPriceValue ?? ''),
    orderDateInput: values.orderDate || currentRow.orderDateInput || '',
    statusValue: String(values.status ?? currentRow.statusValue ?? '').trim().toUpperCase(),
  }),
};
