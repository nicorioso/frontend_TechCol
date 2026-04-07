import axios from "axios";

const API_URL = "http://localhost:8000/reports";

export const getDashboardData = async () => {
  const token = localStorage.getItem("token"); // 👈 tu JWT

  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};