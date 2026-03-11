import { useCallback, useState } from "react";
import authService from "../../api/authService";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      // Capturer les erreurs Django (err.response.data) ou message générique
      const errorData = err.response?.data || { error: err.message };
      setError(errorData);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading, error };
};

export default useRegister;
