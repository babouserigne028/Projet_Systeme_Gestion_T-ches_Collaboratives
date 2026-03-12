import { useCallback, useEffect, useState } from "react";
import utilisateurService from "../../api/utilisateurService";

const useFetchStatsEligibleProf = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mois et année actuels par défaut
  const currentDate = new Date();
  const [mois, setMois] = useState(currentDate.getMonth() + 1);
  const [annee, setAnnee] = useState(currentDate.getFullYear());

  const fetchStatsEligibleProf = useCallback(
    async (monthParam, yearParam) => {
      setLoading(true);
      setError(null);

      try {
        const month = monthParam ?? mois;
        const year = yearParam ?? annee;


        const response =
          await utilisateurService.getStatistiquesEligibiliteProf(month, year);
        setResponse(response?.data || response);
        //console.log("response Endpoint: ", response);
      } catch (err) {
        setError(err.message || "Erreur lors de la récupération des données");
        //console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    },
    [mois, annee],
  );

  // Charger au montage avec le mois/année actuels
  useEffect(() => {
    fetchStatsEligibleProf(mois, annee);
  }, [mois, annee, fetchStatsEligibleProf]);

  // Fonction de rafraîchissement avec les paramètres actuels
  const refreshStatsEligibleProf = useCallback(() => {
    fetchStatsEligibleProf(mois, annee);
  }, [mois, annee, fetchStatsEligibleProf]);

  return {
    response,
    fetchStatsEligibleProf,
    refreshStatsEligibleProf,
    loading,
    error,
    mois,
    setMois,
    annee,
    setAnnee,
  };
};

export default useFetchStatsEligibleProf;
