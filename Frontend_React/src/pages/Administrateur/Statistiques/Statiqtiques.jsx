import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import useFetchStatistiquesProfs from "../../../services/hooks/statistique/useFetchStatistiquesProfs";
import Header from "./Composants/Header";
import KpiStrip from "./Composants/KpiStrip";
import Leaderboard from "./Composants/Leaderboard";
import TeacherDetail from "./Composants/TeacherDetail";
import CompletionChart from "./Composants/CompletionChart";
import TaskBarChart from "./Composants/TaskBarChart";
import LiveActivityChart from "./Composants/LiveActivityChart";
import TeacherTrendChart from "./Composants/TeacherTrendChart";
import PrimeSummaryTable from "./Composants/PrimeSummaryTable";
import {
  enrichTeachers,
  buildMonthlyData,
  buildCompletionData,
  buildBarData,
  MONTHS,
} from "./Composants/helpers";

export default function Statistiques() {
  const [period, setPeriod] = useState("annee");
  const [selectedT, setSelectedT] = useState(null);
  const currentUser = useSelector((s) => s.user.currentUser);
  const isPersonal = currentUser?.role === "professeur";

  const { response, loading, error } = useFetchStatistiquesProfs();

  const teachers = useMemo(
    () => enrichTeachers(response?.professeurs || []),
    [response?.professeurs],
  );

  const monthlyData = useMemo(
    () => buildMonthlyData(teachers, MONTHS),
    [teachers],
  );

  const completionData = useMemo(
    () => buildCompletionData(response?.taux_mensuel, MONTHS),
    [response?.taux_mensuel],
  );

  const barData = useMemo(() => buildBarData(teachers), [teachers]);

  // Auto-select first teacher
  const selected = selectedT || teachers[0] || null;

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">
            Chargement des statistiques…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-32">
        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-center">
          <p className="text-sm font-semibold text-red-700">
            Erreur de chargement
          </p>
          <p className="text-xs text-red-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <Header
        period={period}
        setPeriod={setPeriod}
        totalProfs={response?.resume?.total_profs || 0}
        isPersonal={isPersonal}
      />

      <KpiStrip resume={response?.resume} />

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* LEFT : Ranking + Detail (1/3) */}
        <div className="space-y-4">
          <Leaderboard
            teachers={teachers}
            selectedT={selected}
            setSelectedT={setSelectedT}
          />
          <TeacherDetail teacher={selected} monthlyData={monthlyData} />
        </div>

        {/* RIGHT : Charts (2/3) */}
        <div className="xl:col-span-2 space-y-4">
          <CompletionChart completionData={completionData} />
          <TaskBarChart barData={barData} />
          <LiveActivityChart initialData={response?.activite_recente || []} />
          <TeacherTrendChart
            teachers={teachers}
            monthlyData={monthlyData}
            selectedT={selected}
          />
        </div>
      </div>

      <PrimeSummaryTable
        teachers={teachers}
        selectedT={selected}
        setSelectedT={setSelectedT}
      />
    </div>
  );
}
