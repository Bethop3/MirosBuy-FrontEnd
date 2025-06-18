// router/ProtectedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    console.log("🔒 ProtectedRoute: Verificando autenticación...");

    const checkAuth = async () => {
      try {
        console.log("🍪 Verificando cookie de autenticación...");

        // Hacer petición al backend para verificar la cookie
        const response = await fetch("http://localhost:3000/auth/check", {
          method: "GET",
          credentials: "include", // Importante: incluir cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("📋 Respuesta de auth/check:", data);

        if (data.success && data.authenticated && data.user) {
          console.log("✅ Usuario autenticado:", data.user.email);
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: data.user,
          });
        } else {
          console.log("❌ Usuario no autenticado");
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      } catch (error) {
        console.error("❌ Error verificando autenticación:", error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  // Mostrar loading mientras se verifica
  if (authState.isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          fontFamily: "system-ui",
        }}
      >
        <h2 style={{ color: "#1f2937", marginBottom: "20px" }}>
          🔒 Verificando autenticación...
        </h2>

        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #fb923c",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!authState.isAuthenticated) {
    console.log("🚫 Acceso denegado, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  console.log("✅ Acceso concedido a ruta protegida");
  return children;
}

export default ProtectedRoute;
