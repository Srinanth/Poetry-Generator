import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";

export const server = "https://poetry-generator-3q8c.onrender.com/api/v1";
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


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-center" />
    <App />
  </StrictMode>
);