import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/api';
import { ENTITY_DEFINITIONS } from '../../services/entities/definitions';

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

    const [productsResult, customersResult] = await Promise.allSettled([
      axiosInstance.get('/products'),
      axiosInstance.get('/customers'),
    ]);

    const products = productsResult.status === 'fulfilled' ? productsResult.value.data || [] : [];
    const customers = customersResult.status === 'fulfilled' ? customersResult.value.data || [] : [];

    if (productsResult.status === 'rejected' && customersResult.status === 'rejected') {
      setError('No se pudo cargar la informacion desde el backend.');
    } else if (customersResult.status === 'rejected') {
      setError('Productos cargados. Sin permisos o error al cargar clientes, admins, carts y orders.');
    } else if (productsResult.status === 'rejected') {
      setError('Clientes cargados. Error al cargar productos.');
    }

    const sourceMap = { customers, products };

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

  return {
    tablesData,
    isLoading,
    error,
    reloadEntitiesData: loadEntitiesData,
    removeEntityRow,
    updateEntityRow,
  };
}
