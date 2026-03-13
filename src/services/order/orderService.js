import { axiosInstance } from '../api';

const orderService = {
  /**
   * Obtiene todas las órdenes de un cliente
   * @param {number} customerId - ID del cliente
   * @returns {Promise} Lista de órdenes
   */
  getCustomerOrders: async (customerId) => {
    try {
      const response = await axiosInstance.get(`/order/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  /**
   * Obtiene una orden específica por ID
   * @param {number} orderId - ID de la orden
   * @returns {Promise} Detalles de la orden
   */
  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las órdenes (solo admin)
   * @returns {Promise} Lista de todas las órdenes
   */
  getAllOrders: async () => {
    try {
      const response = await axiosInstance.get('/order');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  /**
   * Actualiza el estado de una orden (solo admin)
   * @param {number} orderId - ID de la orden
   * @param {object} updates - Objeto con los campos a actualizar
   * @returns {Promise} Orden actualizada
   */
  updateOrder: async (orderId, updates) => {
    try {
      const response = await axiosInstance.put(`/order/${orderId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },
};

export default orderService;
