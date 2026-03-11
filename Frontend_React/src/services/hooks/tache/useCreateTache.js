import { useState, useCallback } from "react";
import tacheService from "../../api/tacheService";

export const useCreateTache = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTache = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await tacheService.createTache(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTache, loading, error };
};
