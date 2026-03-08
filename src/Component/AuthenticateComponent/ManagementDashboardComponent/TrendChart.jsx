import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

const TrendChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        // 1. Get your token from where you store it (localStorage or Cookies)
        const token = localStorage.getItem('authToken'); 

        const response = await fetch(`${API_URL}/api/dashboard/management/weekly`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token here
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        // 2. Check if result is actually an array before mapping
        if (Array.isArray(result)) {
          const formatted = result.map(item => ({
            name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            incoming: item.incoming,
            resolved: item.resolved
          }));
          setChartData(formatted);
        } else {
          console?.error("API did not return an array:", result);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div className="h-[300px] w-full mt-6">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} 
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="incoming" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
            <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRes)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
          No data available or Unauthorized...
        </div>
      )}
    </div>
  );
};

export default TrendChart;