import React from 'react';
import { useSelector } from "react-redux";
import { ArrowRight } from 'lucide-react';

const SLAWarning = ({ title, count, icon: Icon,onClick, wave = 'up' }) => {
  const { Language } = useSelector((state) => state.webState);

  const gradientStyles = {
    'total': 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 text-white',
    'not assigned': 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 text-white',
    'resolved': 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 text-white',
    'rejected': 'bg-gradient-to-br from-rose-400 via-rose-500 to-pink-500 text-white',
    'active officers': 'bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 text-white',
    'urgent complaint': 'bg-gradient-to-br from-red-500 via-red-600 to-orange-500 text-white shadow-lg shadow-red-200'

  };

  const defaultStyle = 'bg-white border border-gray-100 text-gray-900';
  const cardStyle = gradientStyles[title.toLowerCase()] || defaultStyle;
  const iconColor = gradientStyles[title.toLowerCase()] ? 'text-white' : 'text-gray-700';

  const waveClass = wave === 'up' ? 'animate-wave-up' : 'animate-wave-down';

  return (
    <div onClick={onClick} className={`
      relative overflow-hidden rounded-3xl p-6 shadow-lg cursor-pointer
      ${cardStyle} ${waveClass}
      hover:scale-[1.03] transition-transform duration-300
    `}>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className={`p-4 rounded-2xl ${iconColor} bg-white/20`}>
          {Icon && <Icon size={24} strokeWidth={2.5} />}
        </div>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/90">{title}</p>
          <h4 className="text-3xl font-black text-white">{count ?? 0}</h4>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <ArrowRight size={16} className="text-white/80" />
      </div>
    </div>
  );
};

export default SLAWarning;