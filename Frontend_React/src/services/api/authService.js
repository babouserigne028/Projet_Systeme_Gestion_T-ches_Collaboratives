import apiClient from "./client";

export const authService = {
  login: (email, password) => {
    return apiClient.post("/api/login/", { email, password });
  },

  checkEmail: (email) => {
    return apiClient.post("/api/check-email/", { email });
  },

  register: (userData) => {
    return apiClient.post("/api/register/", userData);
  },

  getCurrentUser: () => {
    return apiClient.get("/api/me/");
  },

  logout: () => {
    return apiClient.post("/api/logout");
  },
};

export default authService;
