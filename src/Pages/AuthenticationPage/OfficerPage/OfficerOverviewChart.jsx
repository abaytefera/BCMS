import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const OfficerOverviewChart = ({ data, t }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Professional SaaS Color Palette (Matches StatCard logic)
  const chartData = [
    { name: t.statAssigned, value: data?.assigned || 0, color: '#2563eb' },   // Blue-600 (Assigned)
    { name: t.statProgress, value: data?.inProgress || 0, color: '#d97706' }, // Amber-600 (Progress)
    { name: t.statResolved, value: data?.resolved || 0, color: '#059669' },   // Emerald-600 (Resolved)
    { name: t.statRejected, value: data?.rejected || 0, color: '#e11d48' },   // Rose-600 (Rejected)
    { name: t.statOverdue, value: data?.overdue || 0, color: '#9333ea' },     // Purple-600 (Overdue)
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" 
        className="text-[10px] font-black tracking-tighter"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`transition-all duration-500 h-full flex flex-col ${
      DarkMode ? 'bg-transparent' : 'bg-transparent'
    }`}>
      {/* Capitalize instead of Uppercase */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-1 rounded-full bg-primBtn" />
        <h3 className={`text-[11px] font-black capitalize tracking-[0.2em] ${
          DarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Workload distribution
        </h3>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius="60%"  // Modern Donut Style
              outerRadius="90%"    
              paddingAngle={5}     
              stroke={DarkMode ? "#0f172a" : "#fff"} // Adapts stroke to background
              strokeWidth={4}      
              startAngle={90}      
              endAngle={450}
              labelLine={false}
              label={renderCustomizedLabel}
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            
            <Tooltip 
               cursor={{ fill: 'transparent' }}
               contentStyle={{ 
                 backgroundColor: DarkMode ? '#1e293b' : '#ffffff', 
                 borderRadius: '16px', 
                 border: DarkMode ? '1px solid #334155' : 'none', 
                 boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                 padding: '12px'
               }}
               itemStyle={{ 
                 fontSize: '11px', 
                 fontWeight: '900', 
                 textTransform: 'capitalize' 
               }}
               formatter={(value, name) => {
                 const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
                 const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                 return [`${value} Units (${percentage}%)`, name];
               }}
            />
            
            <Legend 
              verticalAlign="bottom" 
              height={40} 
              iconType="circle" 
              formatter={(value) => (
                <span className={`text-[10px] font-black capitalize tracking-wide px-2 ${
                  DarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OfficerOverviewChart;