import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ResolutionPie = ({ data }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Calculate total for the center label
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  // Label inside slice
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Only show percentage for significant slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-[11px] font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`h-[350px] w-full relative transition-colors duration-300 ${DarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      
      {/* Center value display - professional SaaS standard */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
        <span className={`text-[11px] font-semibold capitalize tracking-wider ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Total cases
        </span>
        <span className={`text-4xl font-extrabold tracking-tight ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
          {totalValue.toLocaleString()}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {data.map((entry, index) => (
              <linearGradient key={index} id={`pie-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                {/* Contrast-enhanced gradients */}
                <stop offset="0%" stopColor={entry.colorStart} stopOpacity={1} />
                <stop offset="100%" stopColor={entry.colorEnd} stopOpacity={0.9} />
              </linearGradient>
            ))}
          </defs>

          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="70%" 
            outerRadius="92%"
            paddingAngle={8}  
            labelLine={false}
            label={renderCustomizedLabel}
            stroke="none"      
            cornerRadius={10}   
            animationBegin={0}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell 
                key={index} 
                fill={`url(#pie-grad-${index})`} 
                className="hover:brightness-110 transition-all cursor-pointer outline-none"
              />
            ))}
          </Pie>

          <Tooltip 
            cursor={false}
            contentStyle={{ 
              backgroundColor: DarkMode ? '#1e293b' : '#ffffff', 
              borderRadius: '16px', 
              border: DarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '12px 14px'
            }}
            itemStyle={{
               fontSize: '13px',
               fontWeight: '600',
               textTransform: 'capitalize'
            }}
            formatter={(value, name) => [`${value} cases`, name]}
          />

          <Legend 
            verticalAlign="bottom" 
            iconType="circle" 
            iconSize={10}
            wrapperStyle={{ 
              paddingTop: '20px', 
              textTransform: 'capitalize',
              fontSize: '12px', 
              fontWeight: '600',
              color: DarkMode ? '#efefef' : '#07090c'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResolutionPie;