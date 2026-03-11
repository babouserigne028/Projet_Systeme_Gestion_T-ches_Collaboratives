import apiClient from "./client";

const statistiqueService = {
  getStatistiquesProfs: (annee) => {
    const params = annee ? `?annee=${annee}` : "";
    return apiClient.get(`/api/statistiques/professeurs/${params}`);
  },
};

export default statistiqueService;
