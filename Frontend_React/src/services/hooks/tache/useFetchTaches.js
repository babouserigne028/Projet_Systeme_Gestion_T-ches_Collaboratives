import { useState, useCallback } from "react";
import tacheService from "../../api/tacheService";

export const useFetchTaches = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTaches = useCallback(async (projetId = null) => {
    setLoading(true);
    try {
      const data = await tacheService.getTaches(projetId);
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(
    async (projetId = null) => {
      await fetchTaches(projetId);
    },
    [fetchTaches],
  );

  return { response, loading, error, fetchTaches, refresh };
};
