import React from 'react';
import { useSelector } from 'react-redux';

const SettingCard = ({ title, icon: Icon, children, colorClass = "" }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Professional SaaS card styling based on theme
  const containerClasses = `
    p-8 rounded-[2.5rem] border transition-all duration-300 shadow-sm hover:shadow-xl 
    ${DarkMode 
      ? "bg-slate-900 border-slate-800 hover:border-primBtn/40 shadow-black/20" 
      : `bg-white border-slate-100 hover:border-primBtn/20 shadow-slate-200/50 ${colorClass}`}
  `;

  const iconContainerClasses = `
    p-2.5 rounded-2xl transition-colors duration-300
    ${DarkMode 
      ? "bg-primBtn/10 text-primBtn" 
      : "bg-primBtn/5 text-primBtn"}
  `;

  const titleClasses = `
    text-sm font-black capitalize tracking-wide
    ${DarkMode ? "text-slate-100" : "text-slate-800"}
  `;

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-4 mb-8">
        {/* Icon Container with SaaS "Tint" styling */}
        <div className={iconContainerClasses}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        
        {/* Title with professional spacing */}
        <h3 className={titleClasses}>
          {title}
        </h3>
      </div>

      {/* Content Area */}
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
};

export default SettingCard;