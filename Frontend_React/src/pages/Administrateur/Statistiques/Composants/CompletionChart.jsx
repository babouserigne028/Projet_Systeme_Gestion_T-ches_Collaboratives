import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const CompletionChart = ({ completionData }) => {
  const currentRate = completionData?.[completionData.length - 1]?.taux || 0;

  return (
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
          {currentRate}% actuel
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={completionData}
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
            domain={[0, 100]}
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
  );
};

export default CompletionChart;
