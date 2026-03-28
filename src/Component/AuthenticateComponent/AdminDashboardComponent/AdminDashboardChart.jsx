import React from "react";
import { useSelector } from "react-redux"; // Added to access DarkMode
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
  // Access DarkMode from Redux to update chart colors dynamically
  const { DarkMode } = useSelector((state) => state.webState || {});

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
    <div className={`transition-all duration-300 rounded-[2.5rem] p-8 border h-full shadow-sm 
      ${DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className={`p-3 rounded-2xl transition-colors ${DarkMode ? 'bg-primBtn/20 text-primBtn' : 'bg-emerald-50 text-primBtn'}`}>
          <BarChart3 size={24} />
        </div>
        <div>
          <h3 className={`text-sm font-black tracking-wide capitalize ${DarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === "AMH"
              ? "የአቤቱታዎች የሁኔታ ትንተና"
              : "Complaint status analytics"}
          </h3>
          <p className={`text-[11px] font-bold mt-1 capitalize ${DarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
            {language === "AMH"
              ? `ጠቅላላ አቤቱታዎች: ${data?.totalComplaints || 0}`
              : `Total complaints: ${data?.totalComplaints || 0}`}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="20%"
            margin={{ top: 30, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              {chartData.map((item, i) => (
                <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              vertical={false}
              stroke={DarkMode ? "#1e293b" : "#f1f5f9"}
              strokeDasharray="8 8"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              dy={15}
              tick={{ fill: DarkMode ? "#64748b" : "#94a3b8", fontSize: 11, fontWeight: 700 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: DarkMode ? "#475569" : "#cbd5e1", fontSize: 11 }}
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ fill: DarkMode ? "#1e293b" : "#f8fafc", radius: 15 }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const { name, value, color } = payload[0].payload;
                return (
                  <div className={`rounded-2xl shadow-2xl px-5 py-3 border transition-colors 
                    ${DarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <p className={`text-[10px] font-bold capitalize mb-1 ${DarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{name}</p>
                    <p className="text-lg font-black" style={{ color: color }}>
                      {value.toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />

            {/* Ghost Background Bars for Depth */}
            <Bar
              dataKey="value"
              barSize={55}
              fill={DarkMode ? "#1e293b" : "#f1f5f9"}
              radius={[12, 12, 12, 12]}
              isAnimationActive={false}
            />

            {/* Main Data Bars */}
            <Bar
              dataKey="value"
              barSize={55}
              radius={[12, 12, 12, 12]}
              animationDuration={1500}
              animationBegin={200}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={`url(#gradient-${index})`} />
              ))}

              <LabelList
                dataKey="value"
                position="top"
                offset={10}
                style={{
                  fill: DarkMode ? "#f8fafc" : "#1e293b",
                  fontSize: 13,
                  fontWeight: 900,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
        {chartData.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all
              ${DarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50/50 border-gray-100'}`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full shadow-lg"
              style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}60` }}
            />
            <span className={`text-[11px] font-bold capitalize ${DarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardChart;