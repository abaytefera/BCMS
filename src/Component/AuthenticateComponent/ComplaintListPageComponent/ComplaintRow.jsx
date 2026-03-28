import React from 'react';
import { Eye, Phone, ChevronRight, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ComplaintRow = ({ complaint }) => {
  const navigate = useNavigate();
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Data mapping - Logic remains untouched
  const name = complaint?.citizen_name || "Unknown citizen";
  const phoneNumber = complaint?.phone_number || "No number";
  const trackingId = complaint?.ref_number || complaint?.id || "n/a";
  const status = complaint?.status || "pending";

  // DYNAMIC STATUS COLORS (SaaS Standard)
  const getStatusStyle = (status) => {
    const isDark = DarkMode;
    switch (status.toUpperCase()) {
      case 'IN_PROGRESS':
        return {
          pill: isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-100',
          dot: 'bg-amber-500'
        };
      case 'RESOLVED':
        return {
          pill: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-500'
        };
      case 'REJECTED':
        return {
          pill: isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-100',
          dot: 'bg-rose-500'
        };
      case 'OVERDUE':
        return {
          pill: isDark ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-red-50 text-red-700 border-red-100 animate-pulse',
          dot: 'bg-red-500'
        };
      default: // PENDING
        return {
          pill: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-100',
          dot: 'bg-blue-500'
        };
    }
  };

  const style = getStatusStyle(status);

  return (
    <tr 
      onClick={() => navigate(`/DetailList/${complaint?._id || complaint?.id}`)} 
      className={`group transition-all cursor-pointer border-b last:border-none
        ${DarkMode 
          ? 'hover:bg-slate-800/50 border-slate-800/50' 
          : 'hover:bg-slate-50 border-slate-50'}`}
    >
      {/* TRACKING ID */}
      <td className="px-10 py-6">
        <div className="flex items-center gap-2">
          <Hash size={12} className={DarkMode ? 'text-slate-600' : 'text-slate-300'} />
          <span className={`text-[12px] font-bold font-mono tracking-tight ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {trackingId}
          </span>
        </div>
      </td>

      {/* CITIZEN INFO */}
      <td className="px-10 py-6">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-[1.1rem] flex items-center justify-center text-sm font-black shadow-sm transition-transform group-hover:scale-110
            ${DarkMode ? 'bg-slate-800 text-primBtn border border-slate-700' : 'bg-primBtn text-white'}`}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={`text-[14px] font-black leading-none mb-1.5 capitalize transition-colors
              ${DarkMode ? 'text-slate-200 group-hover:text-primBtn' : 'text-slate-900 group-hover:text-primBtn'}`}>
              {name}
            </p>
            <p className={`text-[11px] font-semibold flex items-center gap-1.5 ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <Phone size={11} strokeWidth={2.5} /> {phoneNumber}
            </p>
          </div>
        </div>
      </td>

      {/* STATUS PILL */}
      <td className="px-10 py-6">
        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-black capitalize border transition-all duration-500 ${style.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${style.dot}`}></span>
          {status.replace('_', ' ')}
        </span>
      </td>

      {/* ACTION BUTTON */}
      <td className="px-10 py-6 text-right">
        <div className="flex justify-end items-center">
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300
            ${DarkMode 
              ? 'bg-slate-900 border-slate-700 text-slate-300 group-hover:border-primBtn/50 group-hover:text-primBtn' 
              : 'bg-white border-slate-200 text-slate-600 group-hover:border-primBtn/30 group-hover:text-primBtn group-hover:shadow-sm'}`}>
            <span className="text-[11px] font-black capitalize tracking-wide">View details</span>
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ComplaintRow;