import { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const LiveActivityChart = ({ initialData }) => {
  const [live, setLive] = useState(true);
  const [liveData, setLiveData] = useState(initialData || []);
  const tickRef = useRef(null);

  useEffect(() => {
    if (initialData?.length) setLiveData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!live) {
      clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      setLiveData((prev) => [
        ...prev.slice(1),
        {
          semaine: "Maintenant",
          taches: Math.round(8 + Math.random() * 14),
          validees: Math.round(5 + Math.random() * 10),
        },
      ]);
    }, 2500);
    return () => clearInterval(tickRef.current);
  }, [live]);

  return (
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
            dataKey="semaine"
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
  );
};

export default LiveActivityChart;
