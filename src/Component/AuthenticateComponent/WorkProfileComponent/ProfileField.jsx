import React from 'react';

const ProfileField = ({ label, value, icon: Icon, isEditing, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
        isEditing ? 'text-textColor' : 'text-slate-400'
      }`}>
        <Icon size={18} />
      </div>
      
      <input
        type={type}
        value={value || ""} 
        disabled={!isEditing}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl pl-14 pr-5 py-4 text-sm transition-all outline-none border
          ${isEditing 
            ? 'border-textColor bg-white text-slate-900 shadow-sm ring-1 ring-textColor' 
            : 'border-slate-100 bg-slate-50/50 text-slate-500 opacity-80 cursor-not-allowed'
          }`}
      />
    </div>
  </div>
);

export default ProfileField;