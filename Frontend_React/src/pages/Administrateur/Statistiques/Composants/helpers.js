export const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export const TEACHER_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#84CC16",
];

export const PRIME_THRESHOLD = 80;

export const scoreColor = (s) =>
  s >= 80 ? "#16A34A" : s >= 65 ? "#D97706" : "#DC2626";

export const scoreBg = (s) =>
  s >= 80
    ? "bg-green-50 border-green-200 text-green-700"
    : s >= 65
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-red-50 border-red-200 text-red-600";

export const enrichTeachers = (teachers) =>
  teachers.map((t, i) => ({
    ...t,
    ini: `${(t.prenom || "")[0] || ""}${(t.nom || "")[0] || ""}`.toUpperCase(),
    color: TEACHER_COLORS[i % TEACHER_COLORS.length],
    name: `${t.prenom || ""} ${t.nom || ""}`.trim(),
    prime: t.prime_eligible,
    tasks: t.taches_totales,
    done: t.taches_completees,
    projects: t.projets,
    score: t.score,
  }));

export const buildMonthlyData = (teachers, months) =>
  months.map((m, i) => {
    const point = { month: m };
    teachers.forEach((t) => {
      point[t.name] = t.mensuel?.[i]?.completees || 0;
    });
    return point;
  });

export const buildCompletionData = (tauxMensuel, months) =>
  months.map((m, i) => ({
    month: m,
    taux: tauxMensuel?.[i]?.taux || 0,
    objectif: PRIME_THRESHOLD,
  }));

export const buildBarData = (teachers) =>
  teachers.map((t) => ({
    name: t.ini,
    fullName: t.name,
    assignées: t.tasks,
    complétées: t.done,
    fill: t.color,
  }));
