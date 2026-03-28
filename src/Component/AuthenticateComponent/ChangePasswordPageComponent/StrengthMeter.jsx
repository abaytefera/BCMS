import React from 'react';
import { useSelector } from 'react-redux';

const StrengthMeter = ({ strength }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Professional SaaS color palette (slightly desaturated for Dark Mode)
  const colors = [
    DarkMode ? 'bg-rose-500/80 shadow-rose-500/20' : 'bg-rose-500',
    DarkMode ? 'bg-amber-500/80 shadow-amber-500/20' : 'bg-amber-500',
    DarkMode ? 'bg-blue-500/80 shadow-blue-500/20' : 'bg-blue-500',
    DarkMode ? 'bg-emerald-500/80 shadow-emerald-500/20' : 'bg-emerald-500'
  ];

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  const getStatusColor = () => {
    if (strength <= 1) return DarkMode ? 'text-rose-400' : 'text-rose-500';
    if (strength === 2) return DarkMode ? 'text-blue-400' : 'text-blue-500';
    return DarkMode ? 'text-emerald-400' : 'text-emerald-500';
  };

  return (
    <div className="mt-5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
      {/* Header with Capitalized Typography */}
      <div className="flex justify-between items-center text-[11px] font-black capitalize tracking-tight">
        <span className={DarkMode ? 'text-slate-500' : 'text-slate-400'}>
          Security level
        </span>
        <span className={`transition-colors duration-500 ${getStatusColor()}`}>
          {labels[strength] || 'Empty'}
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="flex gap-1.5 h-1.5">
        {[0, 1, 2, 3].map((step) => {
          const isActive = step <= strength && strength > 0;
          return (
            <div
              key={step}
              className={`flex-1 rounded-full transition-all duration-700 ease-out shadow-sm
                ${isActive 
                  ? `${colors[strength]} scale-y-110` 
                  : DarkMode ? 'bg-slate-800' : 'bg-slate-100'
                }`}
            />
          );
        })}
      </div>
      
      {/* SaaS Contextual Hint */}
      {strength < 2 && strength > 0 && (
        <p className={`text-[10px] font-medium leading-tight ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          Tip: combine letters, numbers, and symbols for a stronger hash.
        </p>
      )}
    </div>
  );
};

export default StrengthMeter;