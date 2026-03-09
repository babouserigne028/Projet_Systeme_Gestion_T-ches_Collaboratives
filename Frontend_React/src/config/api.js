export const API_URL = "http://127.0.0.1:8000";

export const buildApiUrl = (endpoint) => {
  return `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};
