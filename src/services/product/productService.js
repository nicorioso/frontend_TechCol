import { axiosInstance } from "../api/axios";

/**
 * Servicio de productos
 */
export const productService = {
  /**
   * Obtener todos los productos (público)
   */
  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get('Products');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID (público)
   */
  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`Products${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear producto (protegido - requiere autenticación)
   */
  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('Products', productData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar producto (protegido)
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`Products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar producto (protegido)
   */
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`Products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar productos por nombre
   */
  searchProducts: async (query) => {
    try {
      const response = await axiosInstance.get(`Products/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error buscando productos:', error);
      throw error;
    }
  }
};

export default productService;