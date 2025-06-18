// src/hooks/useExportarProductos.js
import { exportarProductosCSV } from "../services/ProductService";
import useNotification from "./useNotification";

const useExportarProductos = () => {
  const { showNotification } = useNotification();

  const descargarCSV = async () => {
    try {
      showNotification("loading", "Descargando productos...");

      const blob = await exportarProductosCSV();

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "productos.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("success", "✅ Productos descargados correctamente");
    } catch (error) {
      showNotification("error", `❌ ${error}`);
    }
  };

  return { descargarCSV };
};

export default useExportarProductos;
