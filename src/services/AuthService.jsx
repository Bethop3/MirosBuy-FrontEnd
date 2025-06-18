// services/authService.js
const API_BASE_URL = "http://localhost:3000";

class AuthService {
  // Login de administrador con email y contraseña
  static async adminLogin(email, password) {
    try {
      console.log("🔐 AuthService: Intentando login de admin...");
      console.log("📧 Email:", email);

      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      console.log("📡 Response status:", response.status);

      const data = await response.json();
      console.log("📋 Response data:", data);

      return {
        success: response.ok && data.success,
        status: response.status,
        data: data,
        message: data.message || "Error desconocido",
      };
    } catch (error) {
      console.error("❌ AuthService Error:", error);
      return {
        success: false,
        status: 500,
        data: null,
        message: "Error de conexión con el servidor",
      };
    }
  }

  // Obtener información del usuario actual
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          message: "No hay token de autenticación",
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      return {
        success: response.ok && data.success,
        data: data,
        message: data.message || "Error obteniendo usuario",
      };
    } catch (error) {
      console.error("❌ Error obteniendo usuario:", error);
      return {
        success: false,
        message: "Error de conexión",
      };
    }
  }

  // Verificar si el usuario está autenticado
  static async checkAuth() {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return { authenticated: false };
      }

      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error verificando auth:", error);
      return { authenticated: false };
    }
  }

  // Cerrar sesión
  static async logout() {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Limpiar localStorage
      localStorage.removeItem("authToken");

      return { success: true };
    } catch (error) {
      console.error("❌ Error en logout:", error);
      // Limpiar localStorage aunque falle la petición
      localStorage.removeItem("authToken");
      return { success: false };
    }
  }

  // Verificar si hay token guardado
  static hasToken() {
    return !!localStorage.getItem("authToken");
  }

  // Obtener token del localStorage
  static getToken() {
    return localStorage.getItem("authToken");
  }

  // Guardar token en localStorage
  static saveToken(token) {
    localStorage.setItem("authToken", token);
  }

  // Verificar si el usuario es admin (basado en el token)
  static async isAdmin() {
    try {
      const userResponse = await this.getCurrentUser();
      return userResponse.success && userResponse.data?.user?.role === "admin";
    } catch (error) {
      return false;
    }
  }

  // Verificar si el usuario es comprador
  static async isCustomer() {
    try {
      const userResponse = await this.getCurrentUser();
      return userResponse.success && userResponse.data?.user?.role === "user";
    } catch (error) {
      return false;
    }
  }
}

export default AuthService;
