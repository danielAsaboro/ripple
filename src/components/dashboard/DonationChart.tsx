// // File: /components/dashboard/DonationChart.tsx

// import React from "react";
// import Card from "@/components/common/Card";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip,
// } from "recharts";
// import { MoreVertical } from "lucide-react";

// interface DonationData {
//   name: string;
//   value: number;
//   color: string;
// }

// const data: DonationData[] = [
//   { name: "Healthcare", value: 40, color: "#4ade80" },
//   { name: "Education", value: 35, color: "#60a5fa" },
//   { name: "Infrastructure", value: 25, color: "#f97316" },
// ];

// const DonationChart = () => {
//   const totalAmount = data.reduce((sum, item) => sum + item.value * 600, 0);

//   return (
//     <Card className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-sm text-slate-400">Funds Tracking</h3>
//         <button className="text-slate-400 hover:text-slate-300">
//           <MoreVertical className="h-5 w-5" />
//         </button>
//       </div>

//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={5}
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             <Tooltip
//               content={({ active, payload }) => {
//                 if (active && payload && payload.length) {
//                   const data = payload[0].payload;
//                   return (
//                     <div className="bg-slate-800 p-2 rounded shadow text-sm">
//                       <p className="text-white">{data.name}</p>
//                       <p className="text-slate-400">
//                         ${(data.value * 600).toLocaleString()}
//                         <span className="ml-2">({data.value}%)</span>
//                       </p>
//                     </div>
//                   );
//                 }
//                 return null;
//               }}
//             />
//             <Legend
//               verticalAlign="bottom"
//               height={36}
//               content={({ payload }) => (
//                 <div className="flex justify-center gap-6">
//                   {payload?.map((entry, index) => (
//                     <div key={`legend-${index}`} className="flex items-center">
//                       <div
//                         className="w-3 h-3 rounded-full mr-2"
//                         style={{ backgroundColor: entry.color }}
//                       />
//                       <span className="text-sm text-slate-400">
//                         {entry.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-4 pt-4 border-t border-slate-700">
//         <button className="text-sm text-slate-400 hover:text-slate-300">
//           View Details
//         </button>
//       </div>
//     </Card>
//   );
// };

// export default DonationChart;

// File: /components/dashboard/DonationChart.tsx
import React, { useEffect, useState } from "react";
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
import { useProgram } from "@/hooks/useProgram";
import { CampaignCategory } from "@/types";
import { lamportsToSol } from "@/utils/format";
import _ from "lodash";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const categoryColors = {
  healthcare: "#4ade80",
  education: "#60a5fa",
  foodSupply: "#f97316",
  emergencyRelief: "#ef4444",
  infrastructure: "#a78bfa",
  waterSanitation: "#2dd4bf",
};

const DonationChart = () => {
  const { program } = useProgram();
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationData = async () => {
      if (!program) return;

      try {
        // Fetch all campaigns
        const campaigns = await program.account.campaign.all();

        // Group and sum donations by category
        const categoryTotals = _.reduce(
          campaigns,
          (acc, { account }) => {
            const category = Object.keys(account.category)[0];
            const amount = account.raisedAmount.toNumber();
            acc[category] = (acc[category] || 0) + amount;
            return acc;
          },
          {} as Record<string, number>
        );

        // Convert to chart data format
        const chartData = Object.entries(categoryTotals).map(
          ([category, amount]) => ({
            name: _.startCase(category),
            value: lamportsToSol(amount),
            color: categoryColors[category as keyof typeof categoryColors],
          })
        );

        setData(chartData);
      } catch (error) {
        console.error("Error fetching donation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, [program]);

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm text-slate-400">Funds Distribution</h3>
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
                        ◎{data.value.toFixed(2)}
                        <span className="ml-2">
                          ({((data.value / totalAmount) * 100).toFixed(1)}%)
                        </span>
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
                <div className="flex justify-center gap-6 flex-wrap">
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
        <div className="text-sm text-slate-400">
          Total Funds: ◎{totalAmount.toFixed(2)}
        </div>
      </div>
    </Card>
  );
};

export default DonationChart;
