import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

/* ═══════════════════════════════════════════════
   ESMT — Statistiques Professeurs
   Directives : Recharts · Line/Area/Bar charts
   Charte     : même dashboard (light, jaune ESMT)
   Layout     : intégré à DefaultLayout (pas de bg/padding propre)
════════════════════════════════════════════════ */

// ── Icons ─────────────────────────────────────
const Ic = {
  Award: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  TrendUp: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  TrendDn: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  Check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  Clock: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Target: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Users: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Filter: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Download: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Refresh: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  Info: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  ChevronR: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Pulse: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

// ── Data ──────────────────────────────────────
const MONTHS = [
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

const TEACHERS = [
  {
    id: 1,
    name: "Dr. Amadou Diop",
    ini: "AD",
    tasks: 42,
    done: 39,
    projects: 5,
    score: 93,
    prime: true,
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "Prof. Khady Gueye",
    ini: "KG",
    tasks: 35,
    done: 30,
    projects: 4,
    score: 86,
    prime: true,
    color: "#8B5CF6",
  },
  {
    id: 3,
    name: "Mme. Rokhaya Sarr",
    ini: "RS",
    tasks: 31,
    done: 26,
    projects: 4,
    score: 84,
    prime: true,
    color: "#10B981",
  },
  {
    id: 4,
    name: "M. Ousmane Thiam",
    ini: "OT",
    tasks: 28,
    done: 19,
    projects: 3,
    score: 68,
    prime: false,
    color: "#F59E0B",
  },
  {
    id: 5,
    name: "Dr. Lamine Diouf",
    ini: "LD",
    tasks: 20,
    done: 11,
    projects: 2,
    score: 55,
    prime: false,
    color: "#EF4444",
  },
];

// Monthly activity data per teacher (simulated)
const MONTHLY_DATA = MONTHS.map((m, i) => ({
  month: m,
  "Dr. Amadou Diop": Math.round(55 + Math.sin(i * 0.7) * 12 + i * 1.2),
  "Prof. Khady Gueye": Math.round(45 + Math.cos(i * 0.8) * 10 + i * 0.9),
  "Mme. Rokhaya Sarr": Math.round(40 + Math.sin(i * 0.5) * 8 + i * 1.0),
  "M. Ousmane Thiam": Math.round(30 + Math.cos(i * 0.9) * 7 + i * 0.5),
  "Dr. Lamine Diouf": Math.round(22 + Math.sin(i * 0.6) * 6 + i * 0.3),
}));

// Completion rate per month (area chart)
const COMPLETION_DATA = MONTHS.map((m, i) => ({
  month: m,
  taux: Math.min(100, Math.round(68 + i * 1.8 + Math.sin(i * 0.9) * 5)),
  objectif: 80,
}));

// Weekly live-ish tasks data (streaming area)
const WEEKLY_DATA = Array.from({ length: 12 }, (_, i) => ({
  heure: `S-${12 - i}`,
  taches: Math.round(8 + Math.random() * 14 + Math.sin(i * 0.8) * 4),
  validees: Math.round(5 + Math.random() * 10 + Math.sin(i * 0.6) * 3),
})).reverse();

// Bar chart: tasks assigned vs completed per teacher
const BAR_DATA = TEACHERS.map((t) => ({
  name: t.ini,
  fullName: t.name,
  assignées: t.tasks,
  complétées: t.done,
  fill: t.color,
}));

const PRIME_THRESHOLD = 80;

// ── Helpers ───────────────────────────────────
const scoreColor = (s) =>
  s >= 80 ? "#16A34A" : s >= 65 ? "#D97706" : "#DC2626";
const scoreBg = (s) =>
  s >= 80
    ? "bg-green-50 border-green-200 text-green-700"
    : s >= 65
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-red-50   border-red-200   text-red-600";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-bold text-gray-600 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color || p.fill }}
          />
          <span className="text-gray-500">{p.name} :</span>
          <span className="font-bold text-gray-800">
            {p.value}
            {p.name === "taux" || p.name === "objectif" ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── KPI mini card ─────────────────────────────
const KpiCard = ({
  label,
  value,
  sub,
  Icon,
  accent,
  bg,
  border,
  trend,
  trendUp,
}) => (
  <div
    className={`${bg} border ${border} rounded-2xl p-4 flex items-start gap-3`}
  >
    <div
      className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}
      style={{ color: accent }}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p
        className="text-2xl font-extrabold leading-none tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
        {label}
      </p>
      {trend && (
        <div
          className={`flex items-center gap-1 mt-1.5 text-[11px] font-semibold
          ${trendUp ? "text-green-600" : "text-red-500"}`}
        >
          {trendUp ? (
            <Ic.TrendUp className="w-3 h-3" />
          ) : (
            <Ic.TrendDn className="w-3 h-3" />
          )}
          {trend}
        </div>
      )}
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Rank row ──────────────────────────────────
const RankRow = ({ teacher, rank, selected, onSelect }) => {
  const sc = teacher.score;
  const col = scoreColor(sc);
  return (
    <button
      onClick={() => onSelect(teacher)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left
        ${selected ? "border-yellow-300 bg-yellow-50" : "border-transparent hover:border-gray-200 hover:bg-gray-50"}`}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
        ${
          rank === 1
            ? "bg-yellow-400 text-gray-900"
            : rank === 2
              ? "bg-gray-200 text-gray-700"
              : rank === 3
                ? "bg-orange-200 text-orange-700"
                : "bg-gray-100 text-gray-400"
        }`}
      >
        {rank}
      </span>
      <div
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0`}
        style={{
          background: `${teacher.color}18`,
          borderColor: `${teacher.color}55`,
          color: teacher.color,
        }}
      >
        {teacher.ini}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {teacher.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${sc}%`,
                background: `linear-gradient(90deg,${col}88,${col})`,
              }}
            />
          </div>
          <span
            className="text-[11px] font-bold flex-shrink-0"
            style={{ color: col }}
          >
            {sc}%
          </span>
        </div>
      </div>
      {teacher.prime && (
        <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
          Prime
        </span>
      )}
    </button>
  );
};

// ── Teacher detail panel ──────────────────────
const TeacherDetail = ({ teacher }) => {
  const sc = teacher.score;
  const col = scoreColor(sc);
  const pct = (teacher.done / teacher.tasks) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{
            background: `${teacher.color}18`,
            borderColor: `${teacher.color}55`,
            color: teacher.color,
          }}
        >
          {teacher.ini}
        </div>
        <div>
          <p className="font-bold text-gray-800">{teacher.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${scoreBg(sc)}`}
            >
              Score {sc}%
            </span>
            {teacher.prime && (
              <span className="bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                🏆 Prime éligible
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Tâches",
            val: `${teacher.done}/${teacher.tasks}`,
            sub: "complétées",
          },
          { label: "Projets", val: teacher.projects, sub: "actifs" },
          { label: "Taux", val: `${pct.toFixed(0)}%`, sub: "completion" },
        ].map(({ label, val, sub }) => (
          <div
            key={label}
            className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100"
          >
            <p className="text-lg font-extrabold text-gray-800">{val}</p>
            <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500 font-medium">Progression</span>
          <span className="font-bold" style={{ color: col }}>
            {pct.toFixed(1)}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg,${col}88,${col})`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Seuil prime : 80%</span>
          <span>
            {pct >= 80 ? "✓ Éligible" : `Manque ${(80 - pct).toFixed(1)}%`}
          </span>
        </div>
      </div>

      {/* Monthly sparkline for this teacher */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Tâches / mois
        </p>
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart
            data={MONTHLY_DATA}
            margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`grad-${teacher.ini}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor={teacher.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={teacher.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={teacher.name}
              stroke={teacher.color}
              strokeWidth={2}
              fill={`url(#grad-${teacher.ini})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════
export default function Statistiques() {
  const [period, setPeriod] = useState("annee");
  const [selectedT, setSelectedT] = useState(TEACHERS[0]);
  const [live, setLive] = useState(true);
  const [liveData, setLiveData] = useState(WEEKLY_DATA);
  const tickRef = useRef(null);

  // ── Simulated live stream ─────────────────
  useEffect(() => {
    if (!live) {
      clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      setLiveData((prev) => {
        const next = [
          ...prev.slice(1),
          {
            heure: "Maintenant",
            taches: Math.round(8 + Math.random() * 14),
            validees: Math.round(5 + Math.random() * 10),
          },
        ];
        return next;
      });
    }, 2500);
    return () => clearInterval(tickRef.current);
  }, [live]);

  const totalTasks = TEACHERS.reduce((s, t) => s + t.tasks, 0);
  const totalDone = TEACHERS.reduce((s, t) => s + t.done, 0);
  const avgScore = Math.round(
    TEACHERS.reduce((s, t) => s + t.score, 0) / TEACHERS.length,
  );
  const primeCount = TEACHERS.filter((t) => t.prime).length;
  const globalRate = Math.round((totalDone / totalTasks) * 100);

  const PERIODS = [
    { id: "semaine", label: "7 jours" },
    { id: "mois", label: "30 jours" },
    { id: "annee", label: "Année" },
  ];

  return (
    <div className="w-full space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Statistiques Professeurs
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">
            Suivi de performance · Attribution des primes · {TEACHERS.length}{" "}
            professeurs actifs
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Period selector */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                  ${period === p.id ? "bg-yellow-400 text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl
            px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Ic.Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          label="Taux de complétion global"
          value={`${globalRate}%`}
          Icon={Ic.Target}
          accent="#16A34A"
          bg="bg-green-50"
          border="border-green-200"
          trend="+4.2% vs mois dernier"
          trendUp
        />
        <KpiCard
          label="Tâches complétées"
          value={`${totalDone}/${totalTasks}`}
          Icon={Ic.Check}
          accent="#3B82F6"
          bg="bg-blue-50"
          border="border-blue-200"
          sub={`${totalTasks - totalDone} restantes`}
        />
        <KpiCard
          label="Score moyen"
          value={`${avgScore}%`}
          Icon={Ic.Pulse}
          accent="#8B5CF6"
          bg="bg-violet-50"
          border="border-violet-200"
          trend="+2.1% ce mois"
          trendUp
        />
        <KpiCard
          label="Éligibles à la prime"
          value={`${primeCount}/${TEACHERS.length}`}
          Icon={Ic.Award}
          accent="#D97706"
          bg="bg-amber-50"
          border="border-amber-200"
          sub={`Seuil ≥ ${PRIME_THRESHOLD}%`}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ── LEFT : Ranking + Detail (1/3) ── */}
        <div className="space-y-4">
          {/* Leaderboard */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Classement
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                Seuil prime : {PRIME_THRESHOLD}%
              </span>
            </div>
            <div className="space-y-1">
              {[...TEACHERS]
                .sort((a, b) => b.score - a.score)
                .map((t, i) => (
                  <RankRow
                    key={t.id}
                    teacher={t}
                    rank={i + 1}
                    selected={selectedT?.id === t.id}
                    onSelect={setSelectedT}
                  />
                ))}
            </div>
          </div>

          {/* Detail */}
          {selectedT && <TeacherDetail teacher={selectedT} />}
        </div>

        {/* ── RIGHT : Charts (2/3) ── */}
        <div className="xl:col-span-2 space-y-4">
          {/* ── Chart 1 : Taux de complétion mensuel (Area + reference line) ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Taux de complétion mensuel
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Moyenne toute l'équipe · ligne cible 80%
                </p>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                {COMPLETION_DATA[COMPLETION_DATA.length - 1].taux}% actuel
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={COMPLETION_DATA}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradTaux" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[40, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={80}
                  stroke="#EAB308"
                  strokeDasharray="5 3"
                  strokeWidth={1.5}
                  label={{
                    value: "Seuil prime",
                    position: "right",
                    fontSize: 10,
                    fill: "#D97706",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="taux"
                  name="taux"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  fill="url(#gradTaux)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#16A34A" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── Chart 2 : Tâches assignées vs complétées (Bar) ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Tâches assignées vs complétées
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Par professeur · période sélectionnée
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-3 h-3 rounded-sm bg-blue-200 inline-block" />{" "}
                  Assignées
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />{" "}
                  Complétées
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={BAR_DATA}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#F3F4F6"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = BAR_DATA.find((x) => x.name === label);
                    return (
                      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
                        <p className="font-bold text-gray-700 mb-1.5 truncate max-w-[160px]">
                          {d?.fullName}
                        </p>
                        {payload.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 py-0.5"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: p.fill || p.color }}
                            />
                            <span className="text-gray-500">{p.name} :</span>
                            <span className="font-bold text-gray-800">
                              {p.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="assignées" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="complétées"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Chart 3 : Live activity stream (Streaming Area) ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Activité en temps réel
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Tâches créées · validées · mise à jour toutes les 2.5s
                </p>
              </div>
              <button
                onClick={() => setLive((l) => !l)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer
                  ${
                    live
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-gray-100 border-gray-200 text-gray-500"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${live ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                {live ? "Live" : "Pausé"}
              </button>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={liveData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradTaches" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradValid" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#F3F4F6" />
                <XAxis
                  dataKey="heure"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="taches"
                  name="Créées"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#gradTaches)"
                  dot={false}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="validees"
                  name="Validées"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#gradValid)"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-3 h-1.5 rounded-sm bg-blue-400 inline-block" />{" "}
                Tâches créées
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-3 h-1.5 rounded-sm bg-emerald-400 inline-block" />{" "}
                Validées
              </span>
            </div>
          </div>

          {/* ── Chart 4 : Multi-line trend per teacher ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Évolution par professeur
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Tâches complétées · courbes individuelles
                </p>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-3 mt-2">
              {TEACHERS.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500"
                >
                  <span
                    className="w-5 h-0.5 inline-block rounded-full"
                    style={{ background: t.color }}
                  />
                  {t.ini}
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={MONTHLY_DATA}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {TEACHERS.map((t) => (
                  <Line
                    key={t.id}
                    type="monotone"
                    dataKey={t.name}
                    stroke={t.color}
                    strokeWidth={selectedT?.id === t.id ? 2.5 : 1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                    strokeOpacity={
                      selectedT ? (selectedT.id === t.id ? 1 : 0.25) : 1
                    }
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Prime summary table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Récapitulatif des primes
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              Score ≥ 80% → éligible à la prime mensuelle
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
            {primeCount} / {TEACHERS.length} éligibles
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50">
                {[
                  "#",
                  "Professeur",
                  "Tâches",
                  "Projets",
                  "Score",
                  "Taux complétion",
                  "Statut prime",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 sm:px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...TEACHERS]
                .sort((a, b) => b.score - a.score)
                .map((t, i) => {
                  const sc = t.score;
                  const col = scoreColor(sc);
                  const pct = (t.done / t.tasks) * 100;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedT(t)}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer
                      ${selectedT?.id === t.id ? "bg-yellow-50" : ""}`}
                    >
                      <td className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-300">
                        #{i + 1}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                            style={{
                              background: `${t.color}18`,
                              borderColor: `${t.color}55`,
                              color: t.color,
                            }}
                          >
                            {t.ini}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {t.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-600 font-medium">
                        {t.done}
                        <span className="text-gray-300">/{t.tasks}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-600 font-medium">
                        {t.projects}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreBg(sc)}`}
                        >
                          {sc}%
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: `linear-gradient(90deg,${col}88,${col})`,
                              }}
                            />
                          </div>
                          <span
                            className="text-[11px] font-bold w-8 text-right"
                            style={{ color: col }}
                          >
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        {t.prime ? (
                          <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                            <Ic.Award className="w-3 h-3" /> Éligible prime
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            Non éligible
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
