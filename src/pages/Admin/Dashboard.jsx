// src/pages/Admin/Dashboard.jsx
import React from "react";
import useExportarProductos from "../../hooks/useExportarProductos";

function Dashboard() {
  const { descargarCSV } = useExportarProductos();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👑 Bienvenido, Admin</h1>

      <button
        onClick={descargarCSV}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        📥 Descargar Productos (CSV)
      </button>
    </div>
  );
}

export default Dashboard;
