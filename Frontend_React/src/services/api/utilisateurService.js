import apiClient from "./client";

const utilisateurService = {
  /**
   * Récupère tous les utilisateurs + statistiques
   * @returns {Promise} Promesse contenant utilisateurs, stats et comptages
   */
  getUtilisateurs: async () => {
    const utilisateurs = await apiClient.get("/api/utilisateurs/");
    const stats = await apiClient.get("/api/utilisateurs/count/");

    return {
      utilisateurs: utilisateurs,
      total: stats.total,
      Non_validé: stats.Non_validé,
      par_role: stats.par_role,
    };
  },

  /**
   * Récupère le nombre total d'utilisateurs
   * @returns {Promise} Promesse contenant le nombre d'utilisateurs
   */
  getUtilisateursTotal: () => {
    return apiClient.get("/api/utilisateurs/count/");
  },

  /**
   * Récupère le nombre total d'utilisateurs en attente de validation
   * @returns {Promise<{count: number}>} Promesse avec le nombre d'utilisateurs en attente
   */
  getListeUserEnAttentDeValidation: () => {
    return apiClient.get("/api/utilisateurs/awaitingValidation/count/");
  },

  /**
   * Approuve un utilisateur en attente de validation
   * @param {number} UserId - ID de l'utilisateur
   * @returns {Promise} Promesse de la réponse du serveur
   */
  approveUser: (UserId) => {
    return apiClient.patch(`/api/utilisateurs/${UserId}/status/`, {
      is_active: true,
    });
  },

  createUser: (data) => {
    return apiClient.post("/api/utilisateurs/create/", data);
  },

  getUser: (userId) => {
    return apiClient.get(`/api/utilisateurs/${userId}/`);
  },

  updateUser: (userId, data) => {
    return apiClient.patch(`/api/utilisateurs/${userId}/`, data);
  },

  deleteUser: (userId) => {
    return apiClient.delete(`/api/utilisateurs/${userId}/`);
  },

  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return apiClient.upload("/api/me/photo/", formData, "PATCH");
  },

  deletePhoto: () => {
    return apiClient.delete("/api/me/photo/");
  },

  /**
   * Récupère les statistiques d'éligibilité des professeurs pour mois/année
   * @param {number} mois - Mois (0-11)
   * @param {number} annee - Année
   * @returns {Promise} Stats avec nombres, moyennes, primes et listes de professeurs
   */
  getStatistiquesEligibiliteProf: (mois, annee) => {
    return apiClient.post(`/api/professeurs/eligible-for-prime/`, {
      mois: mois + 1,
      annee,
    });
  },
};

export default utilisateurService;
