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

export default CustomTooltip;
