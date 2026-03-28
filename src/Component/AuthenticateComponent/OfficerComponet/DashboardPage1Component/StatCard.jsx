import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* 🎨 Pro-Level Semantic Theme for SaaS Standard */
const iconTheme = {
  assigned: {
    container: "bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    icon: "text-blue-600 dark:text-blue-400",
  },
  in_progress: {
    container: "bg-amber-500/10 border-amber-500/20 shadow-amber-500/5",
    icon: "text-amber-600 dark:text-amber-400",
  },
  resolved: {
    container: "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  rejected: {
    container: "bg-rose-500/10 border-rose-500/20 shadow-rose-500/5",
    icon: "text-rose-600 dark:text-rose-400",
  },
  overdue: {
    container: "bg-purple-500/10 border-purple-500/20 shadow-purple-500/5",
    icon: "text-purple-600 dark:text-purple-400",
  },
};

const StatCard = ({
  title,
  count,
  icon: Icon,
  type,
  onClick,
  wave = "up",
  delay = 0,
}) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  const theme = iconTheme[type] || iconTheme.assigned;

  // ✅ KEEPING YOUR EXACT WAVE MOTION LOGIC
  const yAnim = wave === "up" ? [0, -6, 0] : [0, 6, 0];

  return (
    <motion.div
      onClick={onClick}
      animate={{ y: yAnim }}
      transition={{
        duration: 1.6, // Your original duration
        delay,
        repeat: Infinity,
        repeatType: "loop", // Your original repeat type
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className={`
        relative p-8 rounded-[2.5rem]
        flex flex-col items-center group
        cursor-pointer transition-colors duration-500 border
        ${DarkMode 
          ? "bg-slate-900 border-slate-800 shadow-2xl shadow-black/50" 
          : "bg-white border-slate-100 shadow-xl shadow-slate-200/40"}
      `}
    >
      {/* 🎨 Unique Colored Icon Container (SaaS Standard) */}
      <div className={`
        p-5 rounded-2xl mb-5 border transition-all duration-300
        group-hover:scale-110 group-hover:rotate-3
        ${theme.container}
      `}>
        {Icon && <Icon size={28} className={theme.icon} strokeWidth={2.5} />}
      </div>

      {/* Title - Changed to CAPITALIZE as requested */}
      <p className={`text-[11px] font-black capitalize tracking-[0.2em] mb-1 ${
        DarkMode ? "text-slate-500" : "text-slate-400"
      }`}>
        {title}
      </p>

      {/* Count */}
      <h3 className={`text-4xl font-black tracking-tighter ${
        DarkMode ? "text-white" : "text-slate-900"
      }`}>
        {count ?? 0}
      </h3>

      {/* Small Navigation Arrow Accent */}
      <div className={`absolute bottom-6 right-8 p-2 rounded-xl transition-all ${
        DarkMode 
          ? "bg-slate-800 text-slate-600 group-hover:text-white" 
          : "bg-slate-50 text-slate-300 group-hover:text-slate-600"
      }`}>
        <ArrowRight size={14} strokeWidth={3} />
      </div>

      {/* Live Activity Dot */}
      <div className="absolute top-8 right-8">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
             type === 'rejected' || type === 'overdue' ? 'bg-rose-400' : 'bg-emerald-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
             type === 'rejected' || type === 'overdue' ? 'bg-rose-500' : 'bg-emerald-500'
          }`}></span>
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;