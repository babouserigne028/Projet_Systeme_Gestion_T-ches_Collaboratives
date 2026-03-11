import { useCallback, useEffect, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useFetchStatUsers = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.getUtilisateurs();
      setResponse(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatUsers();
  }, [fetchStatUsers]);

  return { response, refresh: fetchStatUsers, loading, error };
};

export default useFetchStatUsers;
