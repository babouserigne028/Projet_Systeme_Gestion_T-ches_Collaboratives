import apiClient from "./client";

const utilisateurService = {
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
};

export default utilisateurService;
