import React from 'react';

const InfoCard = ({ title, children, className = "" }) => (
  <div className={`bg-white backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-sm ${className}`}>
    <h3 className="text-textColor font-bold uppercase tracking-widest text-[10px] mb-4">
      {title || "Information"}
    </h3>
    {children}
  </div>
);

export default InfoCard;