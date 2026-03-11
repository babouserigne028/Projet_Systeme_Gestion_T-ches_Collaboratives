import ApiClient from "./client";

class TacheService {
  async getTaches(projetId = null) {
    if (projetId) {
      return ApiClient.get(`/api/taches/?projet_id=${projetId}`);
    }
    return ApiClient.get("/api/taches/");
  }

  async getTacheById(id) {
    return ApiClient.get(`/api/taches/${id}/`);
  }

  async createTache(data) {
    return ApiClient.post("/api/taches/", data);
  }

  async updateTache(id, data) {
    return ApiClient.patch(`/api/taches/${id}/`, data);
  }

  async deleteTache(id) {
    return ApiClient.delete(`/api/taches/${id}/`);
  }
}

const tacheService = new TacheService();
export default tacheService;
