import ApiClient from "./client";

class ProjetService {
  async getProjets() {
    return ApiClient.get("/api/projets/");
  }

  async getProjetById(id) {
    return ApiClient.get(`/api/projets/${id}/`);
  }

  async createProjet(data) {
    return ApiClient.post("/api/projets/", data);
  }

  async updateProjet(id, data) {
    return ApiClient.patch(`/api/projets/${id}/`, data);
  }

  async deleteProjet(id) {
    return ApiClient.delete(`/api/projets/${id}/`);
  }

  async addCollaborateur(projetId, userId) {
    return ApiClient.post(`/api/projets/${projetId}/collaborateurs/`, {
      user_id: userId,
    });
  }

  async removeCollaborateur(projetId, collaborateurId) {
    return ApiClient.delete(
      `/api/projets/${projetId}/collaborateurs/${collaborateurId}/`,
    );
  }
}

const projetService = new ProjetService();
export default projetService;
