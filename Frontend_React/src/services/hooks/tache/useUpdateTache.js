import { useState, useCallback } from "react";
import tacheService from "../../api/tacheService";

export const useUpdateTache = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTache = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const response = await tacheService.updateTache(id, data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTache, loading, error };
};
