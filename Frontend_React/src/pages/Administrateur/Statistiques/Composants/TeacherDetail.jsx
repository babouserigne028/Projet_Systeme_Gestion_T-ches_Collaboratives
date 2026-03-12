import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { scoreColor, scoreBg } from "./helpers";

const TeacherDetail = ({ teacher, monthlyData }) => {
  if (!teacher) return null;

  const sc = teacher.score;
  const col = scoreColor(sc);
  const pct = teacher.tasks > 0 ? (teacher.done / teacher.tasks) * 100 : 0;

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
          <span>Seuil prime : 90%</span>
          <span>
            {pct >= 90 ? "✓ Éligible" : `Manque ${(90 - pct).toFixed(1)}%`}
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
            data={monthlyData}
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

export default TeacherDetail;
