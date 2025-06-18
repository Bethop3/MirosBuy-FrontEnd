import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Imagen from "../../assets/Login.gif";
import AuthService from "../../services/authService";

// Configuración de la API - cambiar por tu URL de backend
const API_URL = "http://localhost:3000";

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Estados para efectos visuales
  const [loginStep, setLoginStep] = useState("idle");
  const [notification, setNotification] = useState({
    show: false,
    type: "info",
    message: "",
  });

  // Función para validar email con expresión regular
  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.([a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*)$/;
    return emailRegex.test(email);
  };

  // Función para manejar cambios en el email
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail === "") {
      setEmailError("");
    } else if (!validateEmail(newEmail)) {
      setEmailError("Formato de email inválido");
    } else {
      setEmailError("");
    }
  };

  // Función para obtener el color del border del input de email
  const getEmailInputBorderColor = () => {
    if (emailError && email !== "") {
      return "#ef4444";
    } else if (email !== "" && !emailError) {
      return "#10b981";
    }
    return "#d1d5db";
  };

  // Función para mostrar notificaciones
  const showNotification = (type, message, duration = 4000) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, duration);
  };

  const handleLogin = async () => {
    // Validaciones con notificaciones visuales
    if (!email || !password) {
      showNotification("warning", "⚠️ Por favor, completa todos los campos");
      return;
    }

    if (emailError || !validateEmail(email)) {
      showNotification("warning", "⚠️ Por favor, ingresa un email válido");
      return;
    }

    if (password.length < 6) {
      showNotification(
        "warning",
        "⚠️ La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    setIsLoading(true);
    setLoginStep("validating");
    showNotification("loading", "🔄 Validando credenciales...", 10000);

    try {
      // Delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      setLoginStep("authenticating");
      console.log("🔐 Iniciando login de administrador...");

      const result = await AuthService.adminLogin(email, password);

      if (result.success && result.data.token) {
        setLoginStep("success");
        console.log("✅ Login exitoso");

        // Decodificar el token para obtener información del usuario
        const decoded = jwtDecode(result.data.token);
        console.log("🔓 Token decodificado:", decoded);

        // Guardar en localStorage usando los nombres correctos
        localStorage.setItem("authToken", result.data.token);
        localStorage.setItem("userRole", decoded.role);
        localStorage.setItem("user", JSON.stringify(decoded));

        // También guardar con el método de AuthService si lo tienes
        AuthService.saveToken(result.data.token);

        showNotification(
          "success",
          `✅ ¡Bienvenido, ${result.data.user.name}!`,
          3000
        );

        // Redirigir directamente según el rol sin pasar por /auth/success
        setTimeout(() => {
          showNotification("loading", "🔄 Redirigiendo...", 2000);

          setTimeout(() => {
            if (decoded.role === "admin") {
              console.log("🔑 Redirigiendo a dashboard de admin...");
              navigate("/panel/dashboard", { replace: true });
            } else if (decoded.role === "user") {
              console.log("👤 Redirigiendo a bienvenida de usuario...");
              navigate("/panel/bienvenida", { replace: true });
            } else {
              console.warn("🔒 Rol desconocido:", decoded.role);
              navigate("/login", { replace: true });
            }
          }, 1500);
        }, 2000);
      } else {
        setLoginStep("error");
        console.log("❌ Login fallido:", result.message);

        switch (result.status) {
          case 400:
            showNotification("error", "❌ Faltan datos requeridos");
            break;
          case 401:
            showNotification("error", "❌ Email o contraseña incorrectos");
            break;
          case 404:
            showNotification("error", "❌ Usuario administrador no encontrado");
            break;
          case 500:
            showNotification(
              "error",
              "❌ Error del servidor. Intenta más tarde"
            );
            break;
          default:
            showNotification(
              "error",
              `❌ ${result.message || "Error de autenticación"}`
            );
        }
      }
    } catch (error) {
      setLoginStep("error");
      console.error("❌ Error inesperado:", error);
      showNotification("error", "❌ Error de conexión. Verifica tu internet");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (loginStep !== "success") {
          setLoginStep("idle");
        }
      }, 3000);
    }
  };

  // Función para manejar el login con Google
  const handleGoogleLogin = () => {
    // Este flujo sí pasa por /auth/success porque el backend redirecciona con token en URL
    window.location.href = `${API_URL}/auth/google`;
  };

  // Estilos dinámicos para el botón según el estado
  const getButtonStyles = () => {
    const baseStyles = {
      width: "100%",
      border: "none",
      borderRadius: "8px",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      padding: "12px",
      cursor: isLoading ? "not-allowed" : "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      marginBottom: "16px",
      position: "relative",
      overflow: "hidden",
    };

    const stateStyles = {
      idle: {
        background: "linear-gradient(135deg, #2011ac 0%, #5b33f2 100%)",
        transform: "translateY(0)",
        boxShadow: "0 2px 4px rgba(32, 17, 172, 0.2)",
      },
      validating: {
        background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(245, 158, 11, 0.3)",
      },
      authenticating: {
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
      },
      success: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 12px rgba(16, 185, 129, 0.4)",
      },
      error: {
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        transform: "translateY(0)",
        boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
      },
    };

    return { ...baseStyles, ...stateStyles[loginStep] };
  };

  const getButtonText = () => {
    switch (loginStep) {
      case "validating":
        return "🔍 Validando datos...";
      case "authenticating":
        return "🔐 Autenticando...";
      case "success":
        return "✅ ¡Login exitoso!";
      case "error":
        return "🔄 Intentar nuevamente";
      default:
        return "Iniciar Sesión";
    }
  };

  // Componente de notificación inline
  const NotificationComponent = () => {
    if (!notification.show) return null;

    const notificationStyles = {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      padding: "16px 24px",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontFamily: "system-ui",
      fontWeight: "500",
      fontSize: "14px",
      minWidth: "300px",
      maxWidth: "500px",
      animation: "slideIn 0.3s ease-out",
      backgroundColor: {
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        loading: "#3b82f6",
      }[notification.type],
      color: "white",
    };

    return (
      <div style={notificationStyles}>
        {notification.type === "loading" && (
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
        <span>{notification.message}</span>
        <button
          onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "4px",
            opacity: 0.7,
          }}
        >
          ✕
        </button>
      </div>
    );
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      fontFamily: "system-ui, -apple-system, sans-serif",
      margin: 0,
      padding: 0,
    },
    leftPanel: {
      width: "50%",
      background:
        "linear-gradient(135deg, #2011ac 0%, #3b21d4 50%, #5b33f2 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "48px",
      zIndex: 10,
    },
    decorativeCircle1: {
      position: "absolute",
      top: "0",
      right: "0",
      width: "256px",
      height: "256px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "50%",
      transform: "translate(128px, -128px)",
    },
    decorativeCircle2: {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "192px",
      height: "192px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "50%",
      transform: "translate(-96px, 96px)",
    },
    brandSection: {
      textAlign: "center",
      marginBottom: "32px",
    },
    brandTitle: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "white",
      margin: "0 0 16px 0",
    },
    brandSubtitle: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "18px",
      margin: 0,
    },
    illustrationContainer: {
      background: "rgb(255, 255, 255)",
      backdropFilter: "blur(8px)",
      borderRadius: "24px",
      padding: "32px",
      maxWidth: "400px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    quoteSection: {
      textAlign: "center",
      marginTop: "32px",
    },
    quote: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "14px",
      margin: 0,
    },
    rightPanel: {
      width: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px",
      backgroundColor: "#f9fafb",
    },
    formContainer: {
      width: "100%",
      maxWidth: "400px",
    },
    header: {
      textAlign: "center",
      marginBottom: "32px",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
    },
    logoIcon: {
      width: "48px",
      height: "48px",
      background: "linear-gradient(135deg, #2011ac 0%, #5b33f2 100%)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      marginLeft: "12px",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1f2937",
    },
    welcomeTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1f2937",
      margin: "0 0 8px 0",
    },
    welcomeSubtitle: {
      color: "#6b7280",
      margin: 0,
    },
    googleButton: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      backgroundColor: "white",
      color: "#374151",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.2s",
      marginBottom: "24px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    googleIcon: {
      marginRight: "12px",
      flexShrink: 0,
    },
    divider: {
      position: "relative",
      marginBottom: "24px",
    },
    dividerLine: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: "#d1d5db",
    },
    dividerText: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      fontSize: "14px",
      color: "#6b7280",
    },
    dividerTextInner: {
      backgroundColor: "#f9fafb",
      padding: "0 8px",
    },
    inputGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s",
      boxSizing: "border-box",
    },
    emailInput: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s",
      boxSizing: "border-box",
    },
    errorText: {
      color: "#ef4444",
      fontSize: "12px",
      marginTop: "4px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    successText: {
      color: "#10b981",
      fontSize: "12px",
      marginTop: "4px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    passwordInputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    passwordInput: {
      width: "100%",
      padding: "10px 40px 10px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s",
      boxSizing: "border-box",
    },
    eyeButton: {
      position: "absolute",
      right: "12px",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
      transition: "color 0.2s",
    },
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#374151",
      cursor: "pointer",
    },
    checkbox: {
      marginRight: "8px",
      accentColor: "#2011ac",
    },
    forgotLink: {
      fontSize: "14px",
      color: "#2011ac",
      textDecoration: "none",
      transition: "color 0.2s",
    },
    registerText: {
      textAlign: "center",
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    registerLink: {
      color: "#2011ac",
      textDecoration: "none",
      fontWeight: "500",
      transition: "color 0.2s",
    },
    spinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTopColor: "white",
      animation: "spin 1s linear infinite",
      marginRight: "8px",
    },
    mobileFooter: {
      textAlign: "center",
      marginTop: "32px",
      display: "none",
    },
    loginImage: {
      width: "100%",
      maxWidth: "300px",
      height: "auto",
      objectFit: "contain",
    },
    mobileFooterText: {
      fontSize: "12px",
      color: "#9ca3af",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body, #root {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @media (max-width: 768px) {
            .left-panel {
              display: none !important;
            }
            .right-panel {
              width: 100% !important;
            }
            .mobile-footer {
              display: block !important;
            }
          }
          
          .input:focus {
            outline: none;
            border-color: #2011ac;
            box-shadow: 0 0 0 3px rgba(32, 17, 172, 0.1);
          }
          
          .emailInput:focus {
            outline: none;
            border-color: #2011ac !important;
            box-shadow: 0 0 0 3px rgba(32, 17, 172, 0.1) !important;
          }
          
          .passwordInput:focus {
            outline: none;
            border-color: #2011ac;
            box-shadow: 0 0 0 3px rgba(32, 17, 172, 0.1);
          }
          
          .google-button:hover {
            background-color: #f9fafb;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .forgot-link:hover {
            color: #1a0e8f;
          }
          
          .register-link:hover {
            color: #1a0e8f;
          }
          
          input::placeholder {
            color: #9ca3af;
          }
        `}</style>

        {/* Panel izquierdo */}
        <div style={styles.leftPanel} className="left-panel">
          <div style={styles.decorativeCircle1}></div>
          <div style={styles.decorativeCircle2}></div>

          <div style={styles.brandSection}>
            <h1 style={styles.brandTitle}>MirosBuy</h1>
            <p style={styles.brandSubtitle}>Tu tienda en línea de confianza</p>
          </div>

          <div style={styles.illustrationContainer}>
            <img src={Imagen} alt="Ilustración" style={styles.loginImage} />
          </div>

          <div style={styles.quoteSection}>
            <p style={styles.quote}>
              "Conectamos compradores y vendedores en un solo lugar"
            </p>
          </div>
        </div>

        {/* Panel derecho */}
        <div style={styles.rightPanel} className="right-panel">
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <div style={styles.logoContainer}>
                <div style={styles.logoIcon}>
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    M
                  </span>
                </div>
                <span style={styles.logoText}>MirosBuy</span>
              </div>
              <h2 style={styles.welcomeTitle}>¡Bienvenido de vuelta!</h2>
              <p style={styles.welcomeSubtitle}>Inicia sesión en tu cuenta</p>
            </div>

            {/* Botón de Google */}
            <button
              onClick={handleGoogleLogin}
              style={styles.googleButton}
              className="google-button"
            >
              <svg
                style={styles.googleIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Iniciar sesión con Google
            </button>

            {/* Divisor */}
            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <div style={styles.dividerText}>
                <span style={styles.dividerTextInner}>
                  o continúa con email
                </span>
              </div>
            </div>

            {/* Campos del formulario */}
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                style={{
                  ...styles.emailInput,
                  border: `1px solid ${getEmailInputBorderColor()}`,
                  boxShadow:
                    emailError && email !== ""
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : email !== "" && !emailError
                      ? "0 0 0 3px rgba(16, 185, 129, 0.1)"
                      : "none",
                }}
                className="emailInput"
                placeholder="admin@mirosbuy.com"
                disabled={isLoading}
                required
              />
              {emailError && email !== "" && (
                <div style={styles.errorText}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {emailError}
                </div>
              )}
              {!emailError && email !== "" && validateEmail(email) && (
                <div style={styles.successText}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email válido
                </div>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Contraseña
              </label>
              <div style={styles.passwordInputContainer}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.passwordInput}
                  className="passwordInput"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  disabled={isLoading}
                  onMouseEnter={(e) => (e.target.style.color = "#2011ac")}
                  onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
                >
                  {showPassword ? (
                    // Icono de ojo cerrado (ocultar)
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 6.5c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6.5 12 6.5zm-1.07 1.14L13 9.71c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.15-.7.15-1.06 0-2.48-2.02-4.5-4.5-4.5-.36 0-.72.07-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l2.59 2.59 1.42-1.42L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.04.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
                    </svg>
                  ) : (
                    // Icono de ojo abierto (mostrar)
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={styles.checkboxRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  style={styles.checkbox}
                />
                Mantener sesión iniciada
              </label>
              <a href="#" style={styles.forgotLink} className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de login con estados animados */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              style={getButtonStyles()}
            >
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={styles.spinner}></span>
                  {getButtonText()}
                </div>
              ) : (
                getButtonText()
              )}
            </button>

            <p style={styles.registerText}>
              ¿No tienes una cuenta?{" "}
              <a href="#" style={styles.registerLink} className="register-link">
                Regístrate aquí
              </a>
            </p>

            <div style={styles.mobileFooter} className="mobile-footer">
              <p style={styles.mobileFooterText}>
                © 2024 MirosBuy. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de notificación */}
      <NotificationComponent />
    </>
  );
}

export default App;
