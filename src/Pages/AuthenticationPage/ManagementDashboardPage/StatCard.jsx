import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, gradient, onClick, wave = 'up', delay = 0 }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Wave logic: professional subtle float
  const yWave = wave === 'up' ? [0, -6, 0] : [0, 6, 0];

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: yWave // This creates the continuous floating effect
      }}
      transition={{ 
        opacity: { duration: 0.5, delay },
        y: { 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "mirror", 
          ease: "easeInOut",
          delay: delay 
        } 
      }}
      whileHover={{ scale: 1.02 }} // Subtle scale on hover instead of overriding Y
      className="relative group cursor-pointer h-full"
    >
      {/* Background Layer with SaaS Shadow */}
      <div 
        className={`absolute inset-0 rounded-[2.5rem] transition-all duration-300 ${
          DarkMode 
            ? 'bg-slate-900 border border-slate-800 shadow-2xl shadow-black/50' 
            : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50'
        }`} 
      />

      {/* Content Layer */}
      <div className="relative p-7 flex flex-col items-center z-10">
        {/* Icon Container */}
        <div className={`p-4 rounded-2xl mb-5 transition-transform duration-500 group-hover:scale-110 shadow-lg ${gradient}`}>
          {Icon && <Icon size={24} className="text-white" strokeWidth={2.5} />}
        </div>

        {/* Title & Value */}
        <p className={`text-[11px] font-black capitalize tracking-wider mb-2 transition-colors ${
          DarkMode ? 'text-slate-500 group-hover:text-slate-400' : 'text-slate-400 group-hover:text-slate-600'
        }`}>
          {title}
        </p>
        
        <h3 className={`text-3xl font-black tracking-tight transition-colors ${
          DarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {value}
        </h3>

        {/* Status & Live Dot */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 capitalize">Live</span>
          </div>
          
          <div className={`p-1.5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 ${
            DarkMode ? 'bg-slate-800 text-primBtn' : 'bg-slate-50 text-primBtn'
          }`}>
            <ArrowRight size={14} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${gradient}`} />
    </motion.div>
  );
};

export default StatCard;