import React from 'react';
import { useSelector } from 'react-redux';

const ProfileField = ({ label, value, icon: Icon, isEditing, onChange, type = "text" }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Professional SaaS Input Styling
  const inputBaseClasses = `
    w-full rounded-2xl pl-14 pr-5 py-4 text-sm transition-all duration-300 outline-none border
    ${isEditing 
      ? DarkMode 
        ? 'bg-slate-800 border-primBtn text-slate-100 shadow-lg shadow-primBtn/10 ring-1 ring-primBtn/30' 
        : 'bg-white border-primBtn text-slate-900 shadow-sm ring-1 ring-primBtn/20'
      : DarkMode
        ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
        : 'bg-slate-50 border-slate-100 text-slate-400 opacity-80 cursor-not-allowed'
    }
  `;

  const labelClasses = `
    text-[11px] font-black capitalize tracking-wider ml-1 mb-1.5 block
    ${DarkMode ? 'text-slate-500' : 'text-slate-400'}
  `;

  const iconClasses = `
    absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300
    ${isEditing ? 'text-primBtn' : DarkMode ? 'text-slate-700' : 'text-slate-300'}
  `;

  return (
    <div className="space-y-1 group">
      {/* Label with professional spacing and capitalization */}
      <label className={labelClasses}>
        {label}
      </label>
      
      <div className="relative">
        {/* Animated Icon Container */}
        <div className={iconClasses}>
          <Icon size={19} strokeWidth={2.2} />
        </div>
        
        <input
          type={type}
          value={value || ""} 
          disabled={!isEditing}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label?.toLowerCase()}...`}
          className={inputBaseClasses}
        />

        {/* Subtle edit indicator for professional feel */}
        {isEditing && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-pulse">
            <div className={`w-1.5 h-1.5 rounded-full bg-primBtn shadow-[0_0_8px_rgba(var(--primBtn),0.5)]`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileField;