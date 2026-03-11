const ScoreBar = ({ done, tasks }) => {
  // Sécuriser les valeurs : utiliser 0 si undefined/null
  const safeDone = done ?? 0;
  const safeTasks = tasks ?? 0;

  // Éviter la division par zéro et NaN
  const pct = safeTasks > 0 ? (safeDone / safeTasks) * 100 : 0;
  const col = pct >= 80 ? "#16A34A" : pct >= 65 ? "#D97706" : "#DC2626";

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
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
  );
};

export default ScoreBar;
