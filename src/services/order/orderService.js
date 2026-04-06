import { axiosInstance } from '../api';

const orderService = {
  getAllOrders: async () => {
    try {
      const response = await axiosInstance.get('/order');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  getCustomerOrders: async (customerId) => {
    try {
      const response = await axiosInstance.get(`/order/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/order/detail/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  createOrder: async (payload) => {
    try {
      const response = await axiosInstance.post('/order', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrder: async (orderId, updates) => {
    try {
      const response = await axiosInstance.put(`/order/${orderId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const response = await axiosInstance.delete(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
};

export default orderService;
