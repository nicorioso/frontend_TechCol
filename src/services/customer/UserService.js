import { axiosInstance } from "../api";

const UserService = {
  getProfile: async (id) => {
    const res = await axiosInstance.get(`/customers/${id}`);
    return res.data;
  },

  patchProfile: async (id, data) => {
    const res = await axiosInstance.patch(`/customers/${id}`, data);
    return res.data;
  },

  deleteAccount: async (id) => {
    const res = await axiosInstance.delete(`/customers/${id}`);
    return res.data;
  },

  startPasswordChange: async (email, password) => {
    const res = await axiosInstance.post("/auth/changePasswordAuthen", { email, password });
    return res.data;
  },

  verifyPasswordChangeCode: async (email, code) => {
    const res = await axiosInstance.post("/auth/changePasswordVerifiCode", { email, code });
    return res.data;
  },

  changePassword: async (email, newPassword) => {
    const res = await axiosInstance.post("/auth/changePassword", { email, newPassword });
    return res.data;
  },
};

export default UserService;
