// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./router/Index"; // ← CAMBIAR A ESTO

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter /> {/* ← EN LUGAR DE <Login /> */}
  </StrictMode>
);
