import { axiosInstance } from "../api";

const UserService = {
  // Obtener perfil por id
  getProfile: async (id) => {
    const res = await axiosInstance.get(`/customers/${id}`);
    return res.data;
  },

  // Patch parcial del cliente
  patchProfile: async (id, data) => {
    const res = await axiosInstance.patch(`/customers/${id}`, data);
    return res.data;
  },

  // Eliminar cuenta por id
  deleteAccount: async (id) => {
    const res = await axiosInstance.delete(`/customers/${id}`);
    return res.data;
  },
};

export default UserService;
