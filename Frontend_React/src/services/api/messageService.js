import apiClient from "./client";

const messageService = {
  getMessages: (projetId) => {
    return apiClient.get(`/api/projets/${projetId}/messages/`);
  },

  sendMessage: (projetId, contenu) => {
    return apiClient.post(`/api/projets/${projetId}/messages/`, { contenu });
  },

  getUnreadCounts: () => {
    return apiClient.get("/api/messages/unread/");
  },

  markAsRead: (projetId) => {
    return apiClient.post(`/api/projets/${projetId}/messages/read/`);
  },
};

export default messageService;
