import { useState, useCallback } from "react";
import projetService from "../../api/projetService";

export const useRemoveCollaborateur = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeCollaborateur = useCallback(async (projetId, collaborateurId) => {
    setLoading(true);
    try {
      await projetService.removeCollaborateur(projetId, collaborateurId);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeCollaborateur, loading, error };
};
