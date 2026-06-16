import axios from "axios";

const api = axios.create({
 baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export const sendContactMessage = (data) => api.post("/contact", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);
export const logoutUser = () => api.post("/auth/logout");

export const getProfile = () => api.get("/user/profile");
export const updateProfile = (data) => api.put("/user/profile", data);

export const getDashboardStats = () => api.get("/dashboard/stats");

export default api;