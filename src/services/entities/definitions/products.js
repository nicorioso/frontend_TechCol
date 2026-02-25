const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isNaN(amount) ? 0 : amount);
};

export const productsEntity = {
  key: 'products',
  singularLabel: 'Producto',
  sourceKey: 'products',
  formFields: [
    { name: 'name', label: 'Nombre del producto', placeholder: 'Nombre del producto' },
    { name: 'sku', label: 'SKU', placeholder: 'PRD-001' },
    { name: 'category', label: 'Categoría', placeholder: 'General' },
    { name: 'price', label: 'Precio', type: 'number', placeholder: '0.00' },
    { name: 'stock', label: 'Stock', type: 'number', placeholder: '0' },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'En stock', label: 'En stock' },
        { value: 'Agotado', label: 'Agotado' },
      ],
    },
  ],
  map: (products = []) =>
    products.map((product) => {
      const id = product?.id ?? product?.product_id ?? '-';
      const stock = Number(product?.stock ?? 0);

      return {
        id,
        name: product?.product_name ?? product?.productName ?? '-',
        sku: `PRD-${id}`,
        category: product?.category ?? 'General',
        price: formatCurrency(product?.price),
        stock,
        status: stock > 0 ? 'En stock' : 'Agotado',
      };
    }),
  toFormValues: (row = {}) => ({
    name: row.name || '',
    sku: row.sku || '',
    category: row.category || '',
    price: String(row.price || '').replace(/[^\d.-]/g, ''),
    stock: row.stock ?? '',
    status: row.status || '',
  }),
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    name: values.name || '',
    sku: values.sku || '',
    category: values.category || '',
    price: formatCurrency(values.price),
    stock: Number(values.stock || 0),
    status: values.status || currentRow.status,
  }),
};
