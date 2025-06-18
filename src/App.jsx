import { useState } from "react";
import Imagen from "./assets/Login.png"; // Asegúrate de tener esta imagen en la ruta correcta

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    // Simular proceso de login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(`¡Bienvenido a MirosBuy! Email: ${email}`);
    setIsLoading(false);
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
        "linear-gradient(135deg, #fb923c 0%, #f59e0b 50%, #eab308 100%)",
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
      background: "rgba(255, 255, 255, 0.1)",
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
      background: "linear-gradient(135deg, #fb923c 0%, #eab308 100%)",
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
      accentColor: "#fb923c",
    },
    forgotLink: {
      fontSize: "14px",
      color: "#fb923c",
      textDecoration: "none",
      transition: "color 0.2s",
    },
    loginButton: {
      width: "100%",
      background: "linear-gradient(135deg, #fb923c 0%, #eab308 100%)",
      border: "none",
      borderRadius: "8px",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      padding: "12px",
      cursor: "pointer",
      transition: "all 0.2s",
      marginBottom: "16px",
    },
    registerText: {
      textAlign: "center",
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    registerLink: {
      color: "#fb923c",
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
          border-color: #fb923c;
          box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
        }
        
        .google-button:hover {
          background-color: #f9fafb;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
        }
        
        .login-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .forgot-link:hover {
          color: #ea580c;
        }
        
        .register-link:hover {
          color: #ea580c;
        }
        
        input::placeholder {
          color: #9ca3af;
        }
      `}</style>

      {/* Panel izquierdo - Siempre visible en desktop */}
      <div style={styles.leftPanel} className="left-panel">
        {/* Círculos decorativos */}
        <div style={styles.decorativeCircle1}></div>
        <div style={styles.decorativeCircle2}></div>

        <div style={styles.brandSection}>
          <h1 style={styles.brandTitle}>MirosBuy</h1>
          <p style={styles.brandSubtitle}>Tu tienda en línea de confianza</p>
        </div>

        {/* Ilustración SVG */}
        <div style={styles.illustrationContainer}>
          <img
            src={Imagen}
            alt="Ilustración"
            style={styles.illustrationImage}
          />
        </div>

        <div style={styles.quoteSection}>
          <p style={styles.quote}>
            "Conectamos compradores y vendedores en un solo lugar"
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div style={styles.rightPanel} className="right-panel">
        <div style={styles.formContainer}>
          {/* Header */}
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
            onClick={() => alert("Iniciando sesión con Google...")}
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
              <span style={styles.dividerTextInner}>o continúa con email</span>
            </div>
          </div>

          {/* Campo Email */}
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              className="input"
              placeholder="tu@ejemplo.com"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Recordar y Olvidar contraseña */}
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

          {/* Botón de Login */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
            className="login-button"
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
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          {/* Link de registro */}
          <p style={styles.registerText}>
            ¿No tienes una cuenta?{" "}
            <a href="#" style={styles.registerLink} className="register-link">
              Regístrate aquí
            </a>
          </p>

          {/* Footer móvil */}
          <div style={styles.mobileFooter} className="mobile-footer">
            <p style={styles.mobileFooterText}>
              © 2024 MirosBuy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
