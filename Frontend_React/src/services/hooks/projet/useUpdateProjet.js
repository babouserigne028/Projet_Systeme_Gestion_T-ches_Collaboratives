import { useState, useCallback } from "react";
import projetService from "../../api/projetService";

export const useUpdateProjet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProjet = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const response = await projetService.updateProjet(id, data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProjet, loading, error };
};
