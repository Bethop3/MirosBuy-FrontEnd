import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../pages/Auth/Login";
import AuthSuccess from "../pages/Auth/AuthSuccess";
import Dashboard from "../pages/Admin/Dashboard";
import Bienvenida from "../pages/Users/Bienvenida";

// Componente de ruta protegida
const ProtectedRoute = ({ children, role }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const roleFromStorage = localStorage.getItem("userRole");

    setIsAuthenticated(!!token);
    setUserRole(roleFromStorage);
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Cargando...</div>;

  // Si no hay token, redirige al login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si el rol no coincide, redirige al login también
  if (role && userRole !== role) return <Navigate to="/login" replace />;

  return children;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* Rutas protegidas por rol */}
        <Route
          path="/panel/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel/bienvenida"
          element={
            <ProtectedRoute role="user">
              <Bienvenida />
            </ProtectedRoute>
          }
        />

        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
