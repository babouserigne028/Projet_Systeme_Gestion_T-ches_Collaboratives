import { useState } from "react";
import Avatar from "./Avatar";
import Badge from "./Badge";
import { Ic } from "./data/Icones";
import { TEACHERS } from "./data/Teachers";
import ScoreBar from "./ScoreBar";

const TeacherStat = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  // Filtrer les profs du mois sélectionné
  const teachersThisMonth = TEACHERS.filter(
    (t) => (t.month ?? 0) === selectedMonth,
  );
  const displayTeachers =
    teachersThisMonth.length > 0 ? teachersThisMonth : TEACHERS;

  // Calculer les pourcentages
  const stats = displayTeachers.map((t) => ({
    ...t,
    percentage: Math.round((t.done / t.tasks) * 100),
  }));

  // Fonction pour calculer la prime
  const calculateBonus = (percentage) => {
    if (percentage === 100) return 100000;
    if (percentage >= 90) return 30000;
    return 0;
  };

  // Stats calculées
  const eligible = stats.filter((t) => t.percentage >= 90).length;
  const notEligible = stats.filter((t) => t.percentage < 90).length;
  const avgScore = stats.length
    ? Math.round(stats.reduce((a, b) => a + b.percentage, 0) / stats.length)
    : 0;

  // Calculer la prime totale estimée
  const totalBonus = stats.reduce(
    (total, t) => total + calculateBonus(t.percentage),
    0,
  );
  const formattedBonus = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(totalBonus);

  return (
    <div className="space-y-4">
      {/* Month Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">Mois :</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Éligibles à la prime",
            value: eligible,
            Icon: Ic.Award,
            color: "text-green-700",
            bg: "bg-green-50",
            border: "border-green-200",
          },
          {
            label: "Non éligibles",
            value: notEligible,
            Icon: Ic.X,
            color: "text-red-700",
            bg: "bg-red-50",
            border: "border-red-200",
          },
          {
            label: "Score moyen",
            value: `${avgScore}%`,
            Icon: Ic.Bar,
            color: "text-blue-700",
            bg: "bg-blue-50",
            border: "border-blue-200",
          },
          {
            label: "Prime estimée",
            value: formattedBonus,
            Icon: Ic.Award,
            color: "text-purple-700",
            bg: "bg-purple-50",
            border: "border-purple-200",
          },
        ].map(({ label, value, Icon, color, bg, border }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl border ${border} shadow-sm p-4 flex items-center gap-3`}
          >
            <div
              className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold tracking-tight ${color}`}>
                {value}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2
              px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50"
        >
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Performance pour {months[selectedMonth]}
          </span>
          <Badge color="green">Seuil prime ≥ 90%</Badge>
        </div>

        {/* Scrollable on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50">
                {[
                  "#",
                  "Professeur",
                  "Complétion",
                  "Tâches",
                  "Projets",
                  "Prime",
                  "Statut",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 sm:px-6 py-3
                        text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-300">
                    #{i + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar ini={t.ini} role="Professeur" sm />
                      <span className="text-sm font-semibold text-gray-800">
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 min-w-[140px]">
                    <ScoreBar done={t.done} tasks={t.tasks} />
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-400">
                    {t.done}
                    <span className="text-gray-200">/{t.tasks}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-400">
                    {t.projects}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-800">
                    {calculateBonus(t.percentage) > 0 ? (
                      <span
                        className={
                          calculateBonus(t.percentage) === 100000
                            ? "text-green-600"
                            : "text-blue-600"
                        }
                      >
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                          minimumFractionDigits: 0,
                        }).format(calculateBonus(t.percentage))}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    {t.percentage >= 90 ? (
                      <Badge color={t.percentage === 100 ? "green" : "blue"}>
                        <Ic.Award className="w-3 h-3" />
                        {t.percentage === 100 ? "100% - 100K" : "90%+ - 30K"}
                      </Badge>
                    ) : (
                      <Badge color="gray">Non éligible</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm text-xs text-gray-400 font-medium">
        <Ic.Info className="w-3.5 h-3.5 mt-px flex-shrink-0 text-gray-300" />
        <div>
          <p className="font-semibold text-gray-600">Système de prime :</p>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>90% de tâches complétées → Prime de 30 000 XOF</li>
            <li>100% de tâches complétées → Prime de 100 000 XOF</li>
            <li>En dessous de 90% → Non éligible à la prime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherStat;
