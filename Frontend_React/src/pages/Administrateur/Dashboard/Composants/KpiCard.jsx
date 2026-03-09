import { useEffect, useState } from "react";
import sparkPath from "./SparkPath";
import { SPARKS } from "./data/Sparks";
import { Ic } from "./data/Icones";

const KpiCard = ({
  label,
  value,
  delta,
  positive = true,
  Icon,
  sparkKey,
  accent,
  iconBg,
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, []);
  const path = sparkPath(SPARKS[sparkKey]);
  const uid = `sp-${sparkKey}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3 relative overflow-hidden
        transition-all duration-500 cursor-default hover:shadow-md
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* accent top stripe */}
      <div
        className="absolute top-0 left-8 right-8 h-0.5 rounded-full opacity-60"
        style={{
          background: `linear-gradient(90deg,transparent,${accent},transparent)`,
        }}
      />

      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <span
          className={`flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 border
          ${positive ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}
        >
          <Ic.TrendUp className="w-3 h-3" />
          {delta}
        </span>
      </div>

      <div>
        <p className="text-3xl font-extrabold text-gray-900 leading-none tracking-tight">
          {value}
        </p>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
      </div>

      <svg
        width="100%"
        height="28"
        viewBox="0 0 80 28"
        preserveAspectRatio="none"
        className="opacity-50"
      >
        <defs>
          <linearGradient id={uid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity=".3" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L 80,28 L 0,28 Z`} fill={`url(#${uid})`} />
        <path
          d={path}
          fill="none"
          stroke={accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default KpiCard;
