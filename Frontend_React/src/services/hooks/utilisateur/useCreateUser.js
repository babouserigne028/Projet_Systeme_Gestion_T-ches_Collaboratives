import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.createUser(data);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, loading, error };
};

export default useCreateUser;
