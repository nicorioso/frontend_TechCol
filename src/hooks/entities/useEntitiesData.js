import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/api';
import { ENTITY_DEFINITIONS } from '../../services/entities/definitions';
import { isAdminRole } from '../../utils/authSession';

const EMPTY_TABLES = {
  customers: [],
  admins: [],
  products: [],
  carts: [],
  orders: [],
};

export default function useEntitiesData() {
  const [tablesData, setTablesData] = useState(EMPTY_TABLES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntitiesData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const loadOrders = isAdminRole();
    const loadCarts = isAdminRole();

    const [productsResult, customersResult, ordersResult, cartsResult] = await Promise.allSettled([
      axiosInstance.get('/products'),
      axiosInstance.get('/customers'),
      loadOrders ? axiosInstance.get('/order') : Promise.resolve({ data: [] }),
      loadCarts ? axiosInstance.get('/cart') : Promise.resolve({ data: [] }),
    ]);

    const products = productsResult.status === 'fulfilled' ? productsResult.value.data || [] : [];
    const customers = customersResult.status === 'fulfilled' ? customersResult.value.data || [] : [];
    const orders = ordersResult.status === 'fulfilled' ? ordersResult.value.data || [] : [];
    const carts = cartsResult.status === 'fulfilled' ? cartsResult.value.data || [] : [];

    const failedResources = [];
    if (productsResult.status === 'rejected') failedResources.push('productos');
    if (customersResult.status === 'rejected') failedResources.push('clientes');
    if (loadOrders && ordersResult.status === 'rejected') failedResources.push('pedidos');
    if (loadCarts && cartsResult.status === 'rejected') failedResources.push('carritos');

    if (failedResources.length > 0) {
      setError(`No se pudo cargar correctamente: ${failedResources.join(', ')}.`);
    }

    const sourceMap = { customers, products, orders, carts };

    const mappedData = Object.values(ENTITY_DEFINITIONS).reduce((acc, definition) => {
      const sourceData = sourceMap[definition.sourceKey] || [];
      acc[definition.key] = definition.map(sourceData);
      return acc;
    }, {});

    setTablesData(mappedData);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadEntitiesData();
  }, [loadEntitiesData]);

  const removeEntityRow = (entityKey, rowId) => {
    setTablesData((prev) => ({
      ...prev,
      [entityKey]: (prev[entityKey] || []).filter((row) => String(row.id) !== String(rowId)),
    }));
  };

  const updateEntityRow = (entityKey, rowId, updatedRow) => {
    setTablesData((prev) => ({
      ...prev,
      [entityKey]: (prev[entityKey] || []).map((row) =>
        String(row.id) === String(rowId) ? { ...row, ...updatedRow } : row
      ),
    }));
  };

  const addEntityRow = (entityKey, newRow) => {
    if (!newRow) return;

    setTablesData((prev) => ({
      ...prev,
      [entityKey]: [newRow, ...(prev[entityKey] || [])],
    }));
  };

  return {
    tablesData,
    isLoading,
    error,
    reloadEntitiesData: loadEntitiesData,
    removeEntityRow,
    updateEntityRow,
    addEntityRow,
  };
}
