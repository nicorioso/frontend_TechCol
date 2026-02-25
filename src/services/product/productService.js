import { axiosInstance } from "../api/axios";

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get('Products');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`Products${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo producto ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('Products', productData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`Products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando producto ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`Products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando producto ${id}:`, error);
      throw error;
    }
  },

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