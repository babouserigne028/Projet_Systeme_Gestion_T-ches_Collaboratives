import { useState, useCallback } from "react";
import projetService from "../../api/projetService";

export const useDeleteProjet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteProjet = useCallback(async (id) => {
    setLoading(true);
    try {
      await projetService.deleteProjet(id);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteProjet, loading, error };
};
