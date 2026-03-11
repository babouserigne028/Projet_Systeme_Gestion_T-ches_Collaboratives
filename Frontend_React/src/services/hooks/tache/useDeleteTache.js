import { useState, useCallback } from "react";
import tacheService from "../../api/tacheService";

export const useDeleteTache = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTache = useCallback(async (id) => {
    setLoading(true);
    try {
      await tacheService.deleteTache(id);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTache, loading, error };
};
