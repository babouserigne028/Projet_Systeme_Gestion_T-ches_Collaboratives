import { useCallback, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useApproveUserEnAttente = () => {
  const [error, setError] = useState(null);

  const approveUser = useCallback(async (UserId) => {
    setError(null);
    try {
      const response = await utilisateurService.approveUser(UserId);
      return response;
    } catch (error) {
      setError(error);
    }
  }, []);

  return { approveUser, error };
};

export default useApproveUserEnAttente;
