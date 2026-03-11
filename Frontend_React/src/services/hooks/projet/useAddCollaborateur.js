import { useState, useCallback } from "react";
import projetService from "../../api/projetService";

export const useAddCollaborateur = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCollaborateur = useCallback(async (projetId, userId) => {
    setLoading(true);
    try {
      await projetService.addCollaborateur(projetId, userId);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addCollaborateur, loading, error };
};
