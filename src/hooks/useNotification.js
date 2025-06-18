// hooks/useNotification.js
import { useState } from "react";

const useNotification = () => {
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    message: "",
  });

  const showNotification = (type, message, duration = 4000) => {
    setNotification({
      isVisible: true,
      type,
      message,
      duration,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Métodos de conveniencia
  const showSuccess = (message, duration) =>
    showNotification("success", message, duration);
  const showError = (message, duration) =>
    showNotification("error", message, duration);
  const showWarning = (message, duration) =>
    showNotification("warning", message, duration);
  const showInfo = (message, duration) =>
    showNotification("info", message, duration);
  const showLoading = (message, duration) =>
    showNotification("loading", message, duration);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
};

export default useNotification;
