import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("🔍 Iniciando proceso de autenticación...");

    // Debug: Verificar todos los parámetros de la URL
    console.log("📍 URL completa:", window.location.href);
    console.log("📍 Search params:", window.location.search);

    // Intentar obtener el token de diferentes maneras
    const tokenFromUrl = searchParams.get("token");
    console.log("🎫 Token desde searchParams:", tokenFromUrl);

    // También verificar si viene como hash (después de #)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const tokenFromHash = hashParams.get("token");
    console.log("🎫 Token desde hash:", tokenFromHash);

    // Usar el token que esté disponible
    const finalToken = tokenFromUrl || tokenFromHash;
    console.log("🎫 Token final a usar:", finalToken);

    if (finalToken) {
      try {
        console.log("🔓 Intentando decodificar token...");
        const decoded = jwtDecode(finalToken);
        console.log("✅ Token decodificado exitosamente:", decoded);

        const role = decoded?.role;
        console.log("👤 Rol extraído:", role);
        console.log("👤 Tipo de rol:", typeof role);

        // Guardar en localStorage
        localStorage.setItem("authToken", finalToken);
        localStorage.setItem("userRole", role);
        localStorage.setItem("user", JSON.stringify(decoded));

        console.log("💾 Datos guardados en localStorage");
        console.log("💾 authToken:", localStorage.getItem("authToken"));
        console.log("💾 userRole:", localStorage.getItem("userRole"));

        // Verificar el rol y redirigir
        if (role === "admin") {
          console.log("🔑 Rol admin detectado, redirigiendo a dashboard...");
          navigate("/panel/dashboard", { replace: true });
        } else if (role === "user") {
          console.log("👤 Rol user detectado, redirigiendo a bienvenida...");
          navigate("/panel/bienvenida", { replace: true });
        } else {
          console.warn("🔒 Rol desconocido o faltante:", role);
          console.warn("🔒 Valores posibles en decoded:", Object.keys(decoded));
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("❌ Error al decodificar token:", error);
        console.error("❌ Token que causó el error:", finalToken);
        navigate("/login", { replace: true });
      }
    } else {
      console.warn("❌ No se encontró token en la URL");
      console.warn("❌ Parámetros disponibles:", [...searchParams.keys()]);
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 animate-pulse mb-4">
          🔄 Redirigiendo, por favor espera...
        </p>
        <p className="text-sm text-gray-500">Procesando autenticación...</p>
      </div>
    </div>
  );
}

export default AuthSuccess;
