import React from 'react';
import { useSelector } from "react-redux";
import { ChevronDown, User } from 'lucide-react';

const AssignSelector = ({ label, value, options, onChange, icon: Icon, disabled }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  return (
    <div className="flex flex-col gap-2.5 w-full group">
      {/* Label with Capitalize formatting */}
      {label && (
        <label className={`text-[11px] font-bold capitalize tracking-tight ml-1 transition-colors ${
          DarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {label.toLowerCase()}
        </label>
      )}

      <div className="relative">
        {/* Dynamic Icon Section */}
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 pointer-events-none ${
          DarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {Icon ? <Icon size={18} strokeWidth={2.5} /> : <User size={18} strokeWidth={2.5} />}
        </div>

        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full appearance-none outline-none transition-all duration-300
            py-4 pl-14 pr-12 rounded-2xl text-[13px] font-bold cursor-pointer
            border-2 disabled:cursor-not-allowed disabled:opacity-50
            ${DarkMode 
              ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-primBtn focus:ring-4 focus:ring-primBtn/10' 
              : 'bg-white border-slate-100 text-slate-800 focus:border-primBtn focus:ring-4 focus:ring-primBtn/5 shadow-sm'
            }
          `}
        >
          <option value="" className={DarkMode ? 'bg-slate-900' : 'bg-white'}>
            Select professional...
          </option>
          
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value} 
              className={`capitalize ${DarkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Professional Custom Chevron */}
        <div className={`absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%] ${
          DarkMode ? 'text-slate-600' : 'text-slate-300'
        }`}>
          <ChevronDown size={18} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default AssignSelector;