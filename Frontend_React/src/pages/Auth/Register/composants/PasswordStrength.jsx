export default function PasswordStrength({ pwd }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((r) =>
    r.test(pwd),
  ).length;
  const levels = [
    { label: "Très faible", color: "#ef4444" },
    { label: "Faible", color: "#f97316" },
    { label: "Moyen", color: "#eab308" },
    { label: "Fort", color: "#22c55e" },
  ];
  if (!pwd) return null;
  const lvl = levels[score - 1] || levels[0];
  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? lvl.color : "#e5e7eb" }}
          />
        ))}
      </div>
      <span
        className="text-xs"
        style={{ color: lvl.color, fontFamily: "'Comic Neue', cursive" }}
      >
        {lvl.label}
      </span>
    </div>
  );
}
