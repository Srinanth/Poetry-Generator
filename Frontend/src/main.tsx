
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";

export const server = "https://poetry-ai-theta.vercel.app/api/v1";
axios.defaults.baseURL = server;
axios.defaults.withCredentials = true;

// token to header of authorization handler
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// token expiry handler
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect if already on login page
    if (error.response?.status === 401 && !window.location.pathname.includes("/login")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(
 <>
    <Toaster position="top-center" />
    <App />
    </>
);