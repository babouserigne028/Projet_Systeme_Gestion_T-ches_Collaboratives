import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = useCallback(async (userId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.updateUser(userId, data);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUser, loading, error };
};

export default useUpdateUser;
