import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilisateurService.deleteUser(userId);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUser, loading, error };
};

export default useDeleteUser;
