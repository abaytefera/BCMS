import React from 'react';
import { useSelector } from 'react-redux';

export const ToggleRow = ({ label, description, active, onClick }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  return (
    <div className={`flex items-center justify-between py-4 border-b last:border-0 transition-colors duration-300 ${DarkMode ? "border-slate-800/50" : "border-slate-50"}`}>
      <div className="flex-1 pr-4">
        <p className={`text-xs font-black capitalize tracking-tight ${DarkMode ? "text-slate-200" : "text-slate-700"}`}>
          {label}
        </p>
        {description && (
          <p className={`text-[10px] font-medium mt-1 leading-relaxed ${DarkMode ? "text-slate-500" : "text-slate-400"}`}>
            {description}
          </p>
        )}
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer group">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={active} 
          onChange={onClick} 
        />
        {/* SaaS Premium Toggle Switch */}
        <div className={`
          w-11 h-6 rounded-full transition-all duration-300 ease-in-out
          after:content-[''] after:absolute after:top-[3px] after:left-[3px] 
          after:bg-white after:rounded-full after:h-[18px] after:w-[18px] 
          after:transition-all after:shadow-md peer-checked:after:translate-x-5
          ${DarkMode 
            ? "bg-slate-800 peer-checked:bg-primBtn shadow-inner" 
            : "bg-slate-200 peer-checked:bg-primBtn"}
          group-hover:ring-4 group-hover:ring-primBtn/10
        `}></div>
      </label>
    </div>
  );
};

export const SettingInput = ({ label, value, onChange, placeholder, type = "text", disabled = false }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  const inputClasses = `
    w-full rounded-xl px-4 py-3.5 text-sm transition-all duration-300 outline-none border
    ${DarkMode 
      ? "bg-slate-800/40 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:bg-slate-800 focus:border-primBtn focus:ring-4 focus:ring-primBtn/10" 
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-primBtn focus:ring-4 focus:ring-primBtn/5"}
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  const labelClasses = `
    text-[11px] font-black capitalize tracking-wider ml-1 mb-1.5 block
    ${DarkMode ? "text-slate-500" : "text-slate-400"}
  `;

  return (
    <div className="space-y-1 group">
      <label className={labelClasses}>
        {label}
      </label>
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
    </div>
  );
};