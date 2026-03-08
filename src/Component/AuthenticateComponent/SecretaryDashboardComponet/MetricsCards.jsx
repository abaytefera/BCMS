import React from 'react';

export default function MetricsCards() {
  const cards = [
    { label: 'Pending', value: 56, color: 'bg-blue-500' },
    { label: 'Escalated', value: 66, color: 'bg-orange-500' },
    { label: 'Meetings Today', value: 3, color: 'bg-yellow-500' },
    { label: 'Escalations to Mayor', value: 2, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`p-4 rounded ${card.color} text-white`}>
          <div className="text-lg font-semibold">{card.value}</div>
          <div className="text-sm">{card.label}</div>
        </div>
      ))}
    </div>
  );
}