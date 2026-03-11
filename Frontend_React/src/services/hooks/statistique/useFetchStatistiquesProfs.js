import { useCallback, useEffect, useState } from "react";
import statistiqueService from "../../api/statistiqueService";

const useFetchStatistiquesProfs = (annee) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statistiqueService.getStatistiquesProfs(annee);
      setResponse(data);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, [annee]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { response, loading, error, refresh: fetchStats };
};

export default useFetchStatistiquesProfs;
