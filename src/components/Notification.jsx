// components/Notification.jsx
import { useState, useEffect } from "react";

const Notification = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 4000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Esperar animación de salida
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const getNotificationStyles = () => {
    const baseStyles = {
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
      transform: isAnimating ? "translateX(0)" : "translateX(100%)",
      opacity: isAnimating ? 1 : 0,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    const typeStyles = {
      success: {
        backgroundColor: "#10b981",
        color: "white",
        border: "1px solid #059669",
      },
      error: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "1px solid #dc2626",
      },
      warning: {
        backgroundColor: "#f59e0b",
        color: "white",
        border: "1px solid #d97706",
      },
      info: {
        backgroundColor: "#3b82f6",
        color: "white",
        border: "1px solid #2563eb",
      },
      loading: {
        backgroundColor: "#2011ac",
        color: "white",
        border: "1px solid #1a0e8f",
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const iconStyle = {
      width: "20px",
      height: "20px",
      flexShrink: 0,
    };

    switch (type) {
      case "success":
        return (
          <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "loading":
        return (
          <div
            style={{
              ...iconStyle,
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div style={getNotificationStyles()}>
        {getIcon()}
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={() => {
            setIsAnimating(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: "none",
            border: "none",
            color: "currentColor",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Notification;
