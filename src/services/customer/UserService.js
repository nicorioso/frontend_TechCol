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
};

export default UserService;
