import config from '../../../config/config';

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isNaN(amount) ? 0 : amount);
};

import productService from '../../product/productService';

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
    {
      name: 'image',
      label: 'Imagen',
      type: 'file',
      accept: 'image/*',
      fullWidth: true,
      required: false,
    },
  ],
  map: (products = []) =>
    products.map((product) => {
      const id = product?.id ?? product?.product_id ?? '-';
      const stock = Number(product?.stock ?? 0);
      // build full url for image if provided
      let imageUrl = product?.imageUrl || product?.image || '';
      if (imageUrl) {
        // use configurable uploads path rather than hardcoded
        const host = config.api.baseURL.replace(/\/api\/?$/, '');
        const path = config.uploadsPath.replace(/\/+$/, '');
        imageUrl = `${host}${path}/${imageUrl}`;
      }

      return {
        id,
        name: product?.product_name ?? product?.productName ?? '-',
        sku: `PRD-${id}`,
        category: product?.category ?? 'General',
        price: formatCurrency(product?.price),
        stock,
        status: stock > 0 ? 'En stock' : 'Agotado',
        image: imageUrl,
      };
    }),
  toFormValues: (row = {}) => ({
    name: row.name || '',
    sku: row.sku || '',
    category: row.category || '',
    price: String(row.price || '').replace(/[^\d.-]/g, ''),
    stock: row.stock ?? '',
    status: row.status || '',
    image: null,
  }),
  fromFormValues: (values = {}, currentRow = {}) => ({
    ...currentRow,
    name: values.name || '',
    sku: values.sku || '',
    category: values.category || '',
    price: formatCurrency(values.price),
    stock: Number(values.stock || 0),
    status: values.status || currentRow.status,
    // file will be handled by service; don't stash File object in table row
    image:
      typeof values.image === 'string'
        ? values.image
        : currentRow.image || '',
  }),
  create: async (values) => {
    return productsEntity._sendToService(values, productService.createProduct);
  },
  update: async (id, values) => {
    return productsEntity._sendToService(values, (data) => productService.updateProduct(id, data));
  },
  _sendToService: async (values, serviceFn) => {
    // convert to form data if necessary
    const hasFile = Object.values(values).some(v => v instanceof File);
    if (hasFile) {
      const form = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (v instanceof File) {
          form.append('image', v);
        } else {
          form.append(k, v);
        }
      });
      return serviceFn(form);
    }
    return serviceFn(values);
  },
};
