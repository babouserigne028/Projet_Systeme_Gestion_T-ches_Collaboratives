import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const TeacherTrendChart = ({ teachers, monthlyData, selectedT }) => (
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
      {teachers.map((t) => (
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
        data={monthlyData}
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
        {teachers.map((t) => (
          <Line
            key={t.id}
            type="monotone"
            dataKey={t.name}
            stroke={t.color}
            strokeWidth={selectedT?.id === t.id ? 2.5 : 1.5}
            dot={false}
            activeDot={{ r: 4 }}
            strokeOpacity={selectedT ? (selectedT.id === t.id ? 1 : 0.25) : 1}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TeacherTrendChart;
