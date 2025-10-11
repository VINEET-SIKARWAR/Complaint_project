import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api", // change this later to your deployed backend URL
   withCredentials: true,
});

// Attach JWT token automatically (if stored in localStorage)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
