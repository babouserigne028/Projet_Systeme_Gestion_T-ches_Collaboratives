import { useCallback, useEffect, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useFetchListeUserEnAttentDeValidation = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListeUserEnAttentDeValidation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await utilisateurService.getListeUserEnAttentDeValidation();
      setResponse(response);
      //console.log("Response Api liste UserEnAttent: ", response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListeUserEnAttentDeValidation();
  }, [fetchListeUserEnAttentDeValidation]);

  return {
    response,
    fetchListeUserEnAttentDeValidation,
    loading,
    error,
  };
};

export default useFetchListeUserEnAttentDeValidation;
