import React from 'react';
import { useSelector } from "react-redux";

const InfoCard = ({ title, children, className = "" }) => {
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div 
      className={`
        relative overflow-hidden transition-all duration-300 rounded-3xl p-7 shadow-sm
        ${DarkMode 
          ? 'bg-slate-900/40 border border-slate-800 shadow-slate-950/50 hover:border-slate-700' 
          : 'bg-white border border-slate-100 shadow-slate-200/50 hover:shadow-md'
        } 
        ${className}
      `}
    >
      {/* Subtle accent line for a professional SaaS feel */}
      <div className={`absolute top-0 left-0 w-1 h-full opacity-50 ${DarkMode ? 'bg-primBtn' : 'bg-textColor'}`} />

      {title && (
        <h3 
          className={`
            text-[13px] font-semibold capitalize tracking-tight mb-5 flex items-center gap-2
            ${DarkMode ? 'text-slate-400' : 'text-slate-500'}
          `}
        >
          {title.toLowerCase()}
          <div className={`h-[1px] flex-1 opacity-10 ${DarkMode ? 'bg-white' : 'bg-black'}`} />
        </h3>
      )}

      <div className={`relative z-10 ${DarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
        {children}
      </div>
    </div>
  );
};

export default InfoCard;