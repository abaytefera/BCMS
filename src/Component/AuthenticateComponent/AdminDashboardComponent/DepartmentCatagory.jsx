import React, { useMemo } from 'react';
import { useGetDepartmentWithCatagoryQuery } from '../../../Redux/adminApi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  ['#3b82f6', '#c7d2fe'], // blue
  ['#10b981', '#d1fae5'], // green
  ['#f59e0b', '#fef3c7'], // yellow
  ['#ef4444', '#fecaca'], // red
  ['#8b5cf6', '#e9d5ff'], // purple
  ['#ec4899', '#fbcfe8'], // pink
];

const DepartmentCircularChart = () => {
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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load data</div>;

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-textColor mb-6">Department Active Categories</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {chartData.map((dept) => (
          <div
            key={dept.name}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center transition-transform hover:scale-105"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{dept.name}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: dept.active },
                    { name: 'Inactive', value: dept.inactive },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  cornerRadius={10} // smooth edges
                  paddingAngle={5}
                >
                  <Cell fill={dept.colors[0]} />
                  <Cell fill={dept.colors[1]} />
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}`, `${name}`]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 text-gray-700 font-medium text-lg">
              Active: {dept.active} / Total: {dept.active + dept.inactive}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentCircularChart;
