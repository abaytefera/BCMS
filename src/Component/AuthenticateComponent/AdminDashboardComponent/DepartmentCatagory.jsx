import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import { useGetDepartmentWithCatagoryQuery } from '../../../Redux/adminApi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, PieChart as PieIcon } from 'lucide-react';

const COLORS = [
  ['#3b82f6', '#1e293b'], // Blue
  ['#10b981', '#1e293b'], // Green
  ['#f59e0b', '#1e293b'], // Yellow
  ['#ef4444', '#1e293b'], // Red
  ['#8b5cf6', '#1e293b'], // Purple
  ['#ec4899', '#1e293b'], // Pink
];

const DepartmentCircularChart = () => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  const { data: departWithCategory, isLoading, isError } = useGetDepartmentWithCatagoryQuery();

  const chartData = useMemo(() => {
    if (!departWithCategory) return [];
    return departWithCategory.map((dept, index) => {
      const active = dept.Categories.filter((c) => c.is_active).length;
      const total = dept.Categories.length || 1;
      return {
        name: dept.name,
        active,
        inactive: total - active,
        colors: COLORS[index % COLORS.length],
      };
    });
  }, [departWithCategory]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="animate-spin text-primBtn" size={32} />
      <p className={`text-sm font-bold capitalize ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading analytics...</p>
    </div>
  );
  
  if (isError) return <div className="text-center py-10 text-red-500 font-bold capitalize">Failed to load department data</div>;

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 shadow-sm
      ${DarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-gray-100'}`}>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-primBtn/20 text-primBtn' : 'bg-blue-50 text-blue-600'}`}>
          <PieIcon size={24} />
        </div>
        <div>
          <h2 className={`text-2xl font-black tracking-tight capitalize ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
            Department active categories
          </h2>
          <div className="w-10 h-1 bg-primBtn rounded-full mt-1" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chartData.map((dept, i) => (
          <div
            key={dept.name}
            style={{ animationDelay: `${i * 0.2}s` }}
            className={`group relative p-6 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2
              ${DarkMode 
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-2xl shadow-black/40' 
                : 'bg-gray-50/50 border-slate-100 hover:bg-white hover:shadow-xl shadow-slate-200/50'}
            `}
          >
            <h3 className={`text-center text-sm font-bold capitalize mb-4 tracking-wide ${DarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {dept.name}
            </h3>

            <div className="h-[200px] w-full relative flex items-center justify-center">
              {/* Inner Text Overlay (Professional SaaS Style) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none">
                <span className={`text-2xl font-black ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {Math.round((dept.active / (dept.active + dept.inactive)) * 100)}%
                </span>
                <span className={`text-[9px] font-bold capitalize tracking-tighter ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Active rate
                </span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: dept.active },
                      { name: 'Inactive', value: dept.inactive },
                    ]}
                    innerRadius={65}
                    outerRadius={85}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    cornerRadius={12}
                    paddingAngle={8}
                    stroke="none"
                  >
                    <Cell fill={dept.colors[0]} className="filter drop-shadow-md" />
                    <Cell fill={DarkMode ? "#1e293b" : "#e2e8f0"} />
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      return (
                        <div className={`rounded-xl shadow-2xl px-4 py-2 border text-xs font-bold capitalize
                          ${DarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
                          {payload[0].name}: {payload[0].value}
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={`mt-4 pt-4 border-t flex items-center justify-center gap-2
              ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className={`text-[11px] font-bold capitalize ${DarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {dept.active} active
                </span>
              </div>
              <span className="text-slate-300">/</span>
              <span className={`text-[11px] font-bold capitalize ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {dept.active + dept.inactive} total
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentCircularChart;