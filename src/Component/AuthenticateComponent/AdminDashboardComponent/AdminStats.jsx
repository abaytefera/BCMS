import React from 'react';
import { useSelector } from "react-redux";
import {
  Users,
  FileText,
  Activity,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminStats = ({ CompileList }) => {
  // Logic: Unchanged, including DarkMode selector
  const { Language, DarkMode } = useSelector((state) => state.webState || {});

  const t = {
    totalUsers: Language === "AMH" ? "ጠቅላላ ተጠቃሚዎች" : "Total Users",
    totalComp: Language === "AMH" ? "ጠቅላላ አቤቱታዎች" : "Total Complaints",
    activeCases: Language === "AMH" ? "በሂደት ላይ ያሉ" : "Active Cases",
    closedCases: Language === "AMH" ? "የተዘጉ መዝገቦች" : "Closed Cases",
    live: Language === "AMH" ? "ቀጥታ" : "Live",
  };

  const stats = [
    {
      label: t.totalUsers,
      value: CompileList?.totalUsers ?? 0,
      icon: Users,
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
      url: "/userMg",
    },
    {
      label: t.totalComp,
      value: CompileList?.totalComplaints ?? 0,
      icon: FileText,
      accent: "text-primBtn", 
      bg: "bg-primBtn/10",
      url: "/Complaintlist/admin/list/",
    },
    {
      label: t.activeCases,
      value: CompileList?.activeComplaints ?? 0,
      icon: Activity,
      accent: "text-amber-500",
      bg: "bg-amber-500/10",
      url: "/Complaintlist/admin/active",
    },
    {
      label: t.closedCases,
      value: CompileList?.closedComplaints ?? 0,
      icon: CheckCircle,
      accent: "text-emerald-500",
      bg: "bg-emerald-500/10",
      url: "/Complaintlist/admin/closed",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <Link
            key={i}
            to={stat.url}
            // Restored your animation logic exactly
            style={{ animationDelay: `${i * 0.4}s` }}
            className={`
              group relative overflow-hidden rounded-[2.5rem] p-7 border transition-all duration-300
              hover:scale-[1.03] z-10
              ${i % 2 === 0 ? 'animate-wave-up' : 'animate-wave-down'}
              ${DarkMode 
                ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/50' 
                : 'bg-white border-white/60 shadow-xl shadow-slate-200/50'}
            `}
          >
            {/* SaaS Background Decor */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity ${stat.bg}`} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                {/* Icon Container */}
                <div className={`p-3.5 rounded-2xl transition-transform duration-500 group-hover:rotate-12 ${stat.bg} ${stat.accent}`}>
                  <Icon size={26} strokeWidth={2.2} />
                </div>

                {/* Live Badge */}
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border 
                  ${DarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-50 bg-gray-50'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-[10px] font-black capitalize tracking-widest ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.live}
                  </span>
                </div>
              </div>

              {/* Data Display */}
              <div className="space-y-1">
                <h3 className={`text-4xl font-black tracking-tighter ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </h3>
                {/* Replaced uppercase with capitalize */}
                <p className={`text-[11px] font-bold capitalize tracking-[0.1em] ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stat.label}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className={`absolute bottom-6 right-6 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${DarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
                <ArrowUpRight size={20} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminStats;