"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface LandUseChartProps {
  data: Record<string, number>;
}

export default function LandUseChart({ data }: LandUseChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: value
  })).filter(item => item.value > 0);

  const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#60a5fa"];

  return (
    <div className="w-full h-[280px]">
      <h4 className="text-slate-300 font-medium mb-4 text-center">Land Use Distribution</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            formatter={(value: number) => [`${value} m²`, 'Area']}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
