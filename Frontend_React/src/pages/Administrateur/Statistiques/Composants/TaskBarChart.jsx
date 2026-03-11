import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const TaskBarChart = ({ barData }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-bold text-gray-800">
          Tâches assignées vs complétées
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Par professeur · période sélectionnée
        </p>
      </div>
      <div className="flex items-center gap-3 text-[11px] font-semibold">
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="w-3 h-3 rounded-sm bg-blue-200 inline-block" />{" "}
          Assignées
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />{" "}
          Complétées
        </span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={barData}
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="#F3F4F6"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const d = barData.find((x) => x.name === label);
            return (
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
                <p className="font-bold text-gray-700 mb-1.5 truncate max-w-[160px]">
                  {d?.fullName}
                </p>
                {payload.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 py-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: p.fill || p.color }}
                    />
                    <span className="text-gray-500">{p.name} :</span>
                    <span className="font-bold text-gray-800">{p.value}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Bar dataKey="assignées" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
        <Bar dataKey="complétées" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TaskBarChart;
