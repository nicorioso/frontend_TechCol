import { axiosInstance } from "../api/axios";

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo producto ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      let payload = productData;
      let requestConfig = {};

      if (productData && Object.values(productData).some((v) => v instanceof File)) {
        payload = new FormData();
        Object.entries(productData).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (v instanceof File) {
            payload.append("image", v);
          } else {
            payload.append(k, v);
          }
        });
        requestConfig.headers = { "Content-Type": "multipart/form-data" };
      }

      const response = await axiosInstance.post("/products", payload, requestConfig);
      return response.data;
    } catch (error) {
      console.error("Error creando producto:", error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      let payload = productData;
      let requestConfig = {};

      if (productData && Object.values(productData).some((v) => v instanceof File)) {
        payload = new FormData();
        Object.entries(productData).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (v instanceof File) {
            payload.append("image", v);
          } else {
            payload.append(k, v);
          }
        });
        requestConfig.headers = { "Content-Type": "multipart/form-data" };
      }

      const response = await axiosInstance.post(`/products/update/${id}`, payload, requestConfig);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando producto ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando producto ${id}:`, error);
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await axiosInstance.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error buscando productos:", error);
      throw error;
    }
  },
};

export default productService;
