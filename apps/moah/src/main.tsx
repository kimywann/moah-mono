import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("React 루트 엘리먼트를 찾을 수 없습니다.");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
