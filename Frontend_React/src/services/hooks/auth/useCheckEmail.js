import { useCallback, useState } from "react";
import authService from "../../api/authService";

const useCheckEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);

  const checkEmail = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.checkEmail(email);
      setIsAvailable(response.available);
      return { success: true, available: response.available };
    } catch (err) {
      const errorMessage =
        err.message || "Erreur lors de la vérification de l'email";
      setError(errorMessage);
      setIsAvailable(false);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkEmail, loading, error, isAvailable };
};

export default useCheckEmail;
