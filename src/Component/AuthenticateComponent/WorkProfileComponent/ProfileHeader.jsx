import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldCheck } from 'lucide-react';

const ProfileHeader = ({ name, role }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  
  // Safe Access: Logic remains identical
  const safeName = name || "User profile";
  const avatarLetter = safeName.charAt(0);

  // Professional SaaS Theme Logic
  const titleColor = DarkMode ? "text-slate-100" : "text-slate-900";
  const subtitleColor = DarkMode ? "text-primBtn" : "text-textColor";
  const avatarBg = DarkMode 
    ? "bg-slate-800 border-slate-700 shadow-black/40" 
    : "bg-white border-slate-100 shadow-slate-200/50";

  return (
    <div className="flex flex-col items-center md:items-start gap-8 transition-all duration-300">
      <div className="relative group">
        {/* Modern SaaS Avatar Container */}
        <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[2.8rem] md:rounded-[3.2rem] border-2 flex items-center justify-center text-primBtn text-5xl md:text-6xl font-black shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:rotate-2 ${avatarBg}`}>
          <span className="drop-shadow-sm">{avatarLetter}</span>
          
          {/* Subtle Inner Glow for Premium Feel */}
          <div className="absolute inset-4 rounded-[2rem] border border-primBtn/5 pointer-events-none" />
        </div>
        
        {/* Status Indicator (Online/Verified) */}
        <div className={`absolute bottom-2 right-2 w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg border-4 transition-transform duration-300 group-hover:scale-110 
          ${DarkMode ? "bg-slate-900 border-slate-900" : "bg-white border-white"}`}>
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
        </div>
      </div>

      <div className="text-center md:text-left space-y-3">
        {/* Professional Capitalized Typography */}
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter leading-none capitalize ${titleColor}`}>
          {safeName}
        </h2>
        
        <div className="flex items-center justify-center md:justify-start gap-2">
          <ShieldCheck size={16} className={subtitleColor} />
          <p className={`text-[11px] md:text-xs font-black capitalize tracking-[0.2em] opacity-90 ${subtitleColor}`}>
            {role || "Epa staff member"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;