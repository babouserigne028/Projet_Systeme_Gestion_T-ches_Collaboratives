import { scoreColor, PRIME_THRESHOLD } from "./helpers";

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
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
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

const Leaderboard = ({ teachers, selectedT, setSelectedT }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Classement
      </span>
      <span className="text-[10px] text-gray-400 font-medium">
        Seuil prime : {PRIME_THRESHOLD}%
      </span>
    </div>
    {teachers.length === 0 ? (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-400 font-medium">
          Aucun professeur à afficher
        </p>
      </div>
    ) : (
      <div className="space-y-1">
        {teachers.map((t, i) => (
          <RankRow
            key={t.id}
            teacher={t}
            rank={i + 1}
            selected={selectedT?.id === t.id}
            onSelect={setSelectedT}
          />
        ))}
      </div>
    )}
  </div>
);

export default Leaderboard;
