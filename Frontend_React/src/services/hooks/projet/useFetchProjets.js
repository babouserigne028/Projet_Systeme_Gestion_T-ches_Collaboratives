import { useState, useCallback } from "react";
import projetService from "../../api/projetService";

export const useFetchProjets = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projetService.getProjets();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchProjets();
  }, [fetchProjets]);

  return { response, loading, error, fetchProjets, refresh };
};
