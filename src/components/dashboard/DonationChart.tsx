// File: /components/dashboard/DonationChart.tsx

import React from "react";
import Card from "@/components/common/Card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { MoreVertical } from "lucide-react";

interface DonationData {
  name: string;
  value: number;
  color: string;
}

const data: DonationData[] = [
  { name: "Healthcare", value: 40, color: "#4ade80" },
  { name: "Education", value: 35, color: "#60a5fa" },
  { name: "Infrastructure", value: 25, color: "#f97316" },
];

const DonationChart = () => {
  const totalAmount = data.reduce((sum, item) => sum + item.value * 600, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm text-slate-400">Funds Tracking</h3>
        <button className="text-slate-400 hover:text-slate-300">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-800 p-2 rounded shadow text-sm">
                      <p className="text-white">{data.name}</p>
                      <p className="text-slate-400">
                        ${(data.value * 600).toLocaleString()}
                        <span className="ml-2">({data.value}%)</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex justify-center gap-6">
                  {payload?.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-slate-400">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <button className="text-sm text-slate-400 hover:text-slate-300">
          View Details
        </button>
      </div>
    </Card>
  );
};

export default DonationChart;
