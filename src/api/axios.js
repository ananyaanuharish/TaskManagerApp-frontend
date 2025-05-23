import axios from "axios";

const API = axios.create({
  baseURL: "https://taskmanagerapp-backend-1.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
