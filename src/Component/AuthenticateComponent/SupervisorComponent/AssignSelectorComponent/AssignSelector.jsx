import React from 'react';
import { ChevronDown, User } from 'lucide-react';

const AssignSelector = ({ label, value, options, onChange, icon: Icon }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
      {label}
    </label>
    <div className="relative group">
      {/* Icon Section */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textColor transition-colors">
        {Icon ? <Icon size={18} /> : <User size={18} />}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        /* Updated colors to match your white/slate theme and removed shadow */
        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-10 text-slate-800 font-bold appearance-none outline-none focus:border-textColor focus:ring-1 focus:ring-textColor transition-all cursor-pointer"
      >
        <option value="" className="text-slate-400">
          Select an officer...
        </option>
        
        {options.map((opt) => (
          /* Fix: Use opt.value for the internal value 
             and opt.label for the visible text 
          */
          <option key={opt.value} value={opt.value} className="text-slate-800">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Chevron */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <ChevronDown size={18} />
      </div>
    </div>
  </div>
);

export default AssignSelector;