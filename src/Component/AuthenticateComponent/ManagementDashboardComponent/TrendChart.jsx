import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

const TrendChart = () => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem('authToken'); 

        const response = await fetch(`${API_URL}/api/dashboard/management/weekly`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (Array.isArray(result)) {
          const formatted = result.map(item => ({
            name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            incoming: item.incoming,
            resolved: item.resolved
          }));
          setChartData(formatted);
        } else {
          console?.error("Api did not return an array:", result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div className={`h-[350px] w-full mt-6 transition-colors duration-300 ${DarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* High-Contrast Blue Gradient */}
              <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={DarkMode ? 0.4 : 0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              {/* High-Contrast Emerald Gradient */}
              <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={DarkMode ? 0.4 : 0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={DarkMode ? "#ffffff10" : "#e2e8f0"} 
              vertical={false} 
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{
                fill: DarkMode ? '#94a3b8' : '#64748b', 
                fontSize: 11, 
                fontWeight: '700',
                textTransform: 'capitalize' 
              }} 
              dy={10}
            />
            
            <YAxis hide />
            
            <Tooltip 
              cursor={{ stroke: DarkMode ? '#334155' : '#e2e8f0', strokeWidth: 2 }}
              contentStyle={{ 
                backgroundColor: DarkMode ? '#0f172a' : '#ffffff', 
                border: DarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0', 
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
              itemStyle={{ 
                fontSize: '13px', 
                fontWeight: '800', 
                textTransform: 'capitalize' 
              }}
              labelStyle={{
                color: DarkMode ? '#94a3b8' : '#64748b',
                marginBottom: '4px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            />

            <Area 
              type="monotone" 
              dataKey="incoming" 
              name="Incoming cases"
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorInc)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="resolved" 
              name="Resolved cases"
              stroke="#10b981" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorRes)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <div className="w-8 h-8 border-4 border-primBtn border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm font-bold capitalize italic ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
           Loading weekly data...
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendChart;