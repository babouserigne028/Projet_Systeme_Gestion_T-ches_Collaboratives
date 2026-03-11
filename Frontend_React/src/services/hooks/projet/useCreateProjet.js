import { useState, useCallback } from "react";
import projetService from "../../api/projetService";

export const useCreateProjet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProjet = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await projetService.createProjet(data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createProjet, loading, error };
};
