import { useState, useCallback } from "react";
import apiClient from "../../api/client";

export const useFetchEtuDashboard = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/api/etudiant/dashboard/");
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { response, loading, error, refresh };
};
