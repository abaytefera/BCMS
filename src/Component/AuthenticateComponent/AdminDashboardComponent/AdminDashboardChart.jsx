import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { BarChart3 } from "lucide-react";

const AdminDashboardChart = ({ data, language }) => {
  const chartData = [
    {
      name: language === "AMH" ? "ገባሪ" : "Active",
      value: data?.activeComplaints || 0,
      color: "#3b82f6",
    },
    {
      name: language === "AMH" ? "የተፈቱ" : "Resolved",
      value: data?.resolvedComplaints || 0,
      color: "#10b981",
    },
    {
      name: language === "AMH" ? "የተዘጉ" : "Closed",
      value: data?.closedComplaints || 0,
      color: "#6366f1",
    },
    {
      name: language === "AMH" ? "ውድቅ" : "Rejected",
      value: data?.rejectedComplaints || 0,
      color: "#ef4444",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-primBtn">
          <BarChart3 size={22} />
        </div>
        <div>
          <h3 className="text-xs font-black text-gray-900 tracking-widest uppercase">
            {language === "AMH"
              ? "የአቤቱታዎች የሁኔታ ትንተና"
              : "Complaint Status Analytics"}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1">
            {language === "AMH"
              ? `ጠቅላላ አቤቱታዎች: ${data?.totalComplaints || 0}`
              : `Total Complaints: ${data?.totalComplaints || 0}`}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="15%"
            margin={{ top: 30, right: 20, left: -20, bottom: 0 }}
          >
            {/* Gradients & Patterns */}
            <defs>
              {chartData.map((item, i) => (
                <linearGradient
                  key={i}
                  id={`gradient-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={item.color} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0.4} />
                </linearGradient>
              ))}

              <pattern
                id="diagonalLines"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#eef2f7"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              dy={14}
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 800 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const { name, value } = payload[0].payload;

                return (
                  <div className="bg-white rounded-2xl shadow-xl px-4 py-3 text-xs">
                    <p className="font-black text-gray-900">{name}</p>
                    <p className="mt-1 font-extrabold text-blue-600">
                      {value.toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />

            {/* Background bars */}
            <Bar
              dataKey="value"
              barSize={70}
              fill="#f1f5f9"
              radius={[14, 14, 0, 0]}
            />

            {/* Main bars */}
            <Bar
              dataKey="value"
              barSize={62}
              radius={[14, 14, 0, 0]}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={`url(#gradient-${index})`} />
              ))}

              <LabelList
                dataKey="value"
                position="top"
                style={{
                  fill: "#374151",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              />
            </Bar>

            {/* Diagonal stripe overlay */}
            <Bar
              dataKey="value"
              barSize={62}
              radius={[14, 14, 0, 0]}
              fill="url(#diagonalLines)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Legend */}
      <div className="grid grid-cols-2 gap-2 mt-6">
        {chartData.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] font-bold text-gray-500">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardChart;
