import axios from "axios";

const API_URL = "http://localhost:3000/api"; // o donde tengas tu backend

export const exportarProductosCSV = async () => {
  const token = localStorage.getItem("authToken");

  const response = await axios.get(`${API_URL}/productos/exportar-csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob", // 👈 importante para descargar archivos
  });

  return response.data;
};
