import { axiosInstance } from "../api";

const paymentService = {
  createPaypalOrder: async () => {
    const response = await axiosInstance.post("/paypal/create-order");
    return response.data;
  },

  capturePaypalOrder: async (paypalOrderId) => {
    if (!paypalOrderId) {
      throw new Error("paypalOrderId is required");
    }

    const response = await axiosInstance.post(`/paypal/capture/${paypalOrderId}`);
    return response.data;
  },
};

export default paymentService;
