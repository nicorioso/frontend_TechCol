import { axiosInstance } from "../api/axios";

export const productService = {
  _buildProductFormData: (productData = {}) => {
    const {
      image,
      productName,
      product_name,
      name,
      description,
      category,
      price,
      stock,
    } = productData || {};

    const payload = new FormData();
    payload.append(
      "data",
      JSON.stringify({
        productName: productName ?? product_name ?? name ?? "",
        description: description ?? category ?? "",
        price:
          price === "" || price === undefined || price === null
            ? 0
            : Number(price),
        stock:
          stock === "" || stock === undefined || stock === null
            ? 0
            : Number(stock),
      })
    );

    if (image instanceof File) {
      payload.append("image", image);
    }

    return payload;
  },
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
      const isFormData = productData instanceof FormData;
      const payload = isFormData
        ? productData
        : productService._buildProductFormData(productData);
      const requestConfig = isFormData
        ? {}
        : { headers: { "Content-Type": "multipart/form-data" } };

      const response = await axiosInstance.post("/products", payload, requestConfig);
      return response.data;
    } catch (error) {
      console.error("Error creando producto:", error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const isFormData = productData instanceof FormData;
      const payload = isFormData
        ? productData
        : productService._buildProductFormData(productData);
      const requestConfig = isFormData
        ? {}
        : { headers: { "Content-Type": "multipart/form-data" } };

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
