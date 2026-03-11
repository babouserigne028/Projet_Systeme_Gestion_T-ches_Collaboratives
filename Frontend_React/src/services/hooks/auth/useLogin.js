import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../../api/authService";
import { setCurrentUser } from "../../../store/userSlice";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.login(email, password);
        if (response.access && response.refresh) {
          sessionStorage.setItem("token", response.access);
          localStorage.setItem("refresh", response.refresh);
          try {
            const user = await authService.getCurrentUser();
            dispatch(setCurrentUser(user));
            const dest =
              user.role === "professeur"
                ? "/prof/dashboard"
                : user.role === "etudiant"
                  ? "/etu/dashboard"
                  : "/dashboard";
            navigate(dest);
            return { success: true, data: { ...response, user } };
          } catch (userErr) {
            setError("Impossible de récupérer l'utilisateur");
            return {
              success: false,
              error: "Impossible de récupérer l'utilisateur",
            };
          }
        } else {
          setError("Identifiant ou Mot de passe Incorrecte");
          return {
            success: false,
            error: "Identifiant ou Mot de passe Incorrecte",
          };
        }
      } catch (err) {
        let errorMessage = "Erreur de connexion";
        if (err.response && err.response.data) {
          const data = err.response.data;
          const detail = data.detail || "";
          const errorStr = JSON.stringify(data).toLowerCase();

          if (
            detail.includes(
              "No active account found with the given credentials",
            )
          ) {
            errorMessage =
              "Votre compte est en cours de validation. Un email vous sera envoyé sous 24h.";
          } else if (
            errorStr.includes("inactif") ||
            errorStr.includes("non actif") ||
            errorStr.includes("not active") ||
            errorStr.includes("validation") ||
            errorStr.includes("en attente") ||
            detail.includes("inactif")
          ) {
            errorMessage =
              "Votre compte est en cours de validation. Un email vous sera envoyé sous 24h.";
          } else if (
            errorStr.includes("identifiant") ||
            errorStr.includes("incorrect") ||
            errorStr.includes("invalid") ||
            detail.includes("not found")
          ) {
            errorMessage = "Identifiant ou Mot de passe Incorrecte";
          } else {
            errorMessage =
              detail ||
              data.error ||
              data.non_field_errors?.[0] ||
              err.message ||
              "Erreur de connexion";
          }
        } else {
          errorMessage = err.message || "Erreur de connexion";
        }

        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [navigate, dispatch],
  );
  return { loading, error, login };
};

export default useLogin;
