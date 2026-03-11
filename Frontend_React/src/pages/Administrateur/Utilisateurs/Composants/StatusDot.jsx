const StatusDot = ({ active }) => {
  const statusMeta = {
    true: {
      cls: "bg-green-100 text-green-700 border-green-200",
      dot: "bg-green-500",
      label: "Actif",
    },
    false: {
      cls: "bg-gray-100 text-gray-600 border-gray-200",
      dot: "bg-gray-400",
      label: "Inactif",
    },
  };

  const m = statusMeta[active];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${m.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

export default StatusDot;
