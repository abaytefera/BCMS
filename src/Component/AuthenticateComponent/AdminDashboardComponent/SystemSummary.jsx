import React from 'react';
import { useSelector } from "react-redux";
import { ShieldCheck, Layers, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SystemSummary = ({ catagory, dep }) => {
  // Logic: Unchanged, simply added DarkMode to the selector
  const { Language, DarkMode } = useSelector((state) => state.webState || {});

  const t = {
    officers: Language === "AMH" ? "የስራ ዘርፎች" : "Categories",
    categories: Language === "AMH" ? "ክፍሎች" : "Departments",
  };

  const summaries = [
    {
      title: t.officers,
      value: catagory || 5,
      icon: ShieldCheck,
      url: "/CatagoryMg",
      color: "text-blue-500",
      bgColor: DarkMode ? "bg-blue-500/10" : "bg-blue-50",
    },
    {
      title: t.categories,
      value: dep || 3,
      icon: Layers,
      url: "/DepartmentMg",
      color: "text-emerald-500",
      bgColor: DarkMode ? "bg-emerald-500/10" : "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {summaries.map((item, i) => {
        const CardContent = (
          <div className={`
            flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 group w-full
            ${DarkMode 
              ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900 shadow-xl shadow-black/20' 
              : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg shadow-slate-200/50'}
          `}>
            <div className="flex items-center gap-5">
              {/* Icon Container with SaaS depth */}
              <div className={`${item.color} ${item.bgColor} p-3.5 rounded-2xl transition-transform duration-500 group-hover:rotate-6 flex-shrink-0`}>
                <item.icon size={24} strokeWidth={2} />
              </div>
              
              <div>
                {/* STRICT USE OF CAPITALIZE - NO UPPERCASE */}
                <p className={`text-[11px] font-bold capitalize tracking-wide mb-1 ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {item.title}
                </p>
                <p className={`text-2xl font-black tracking-tight leading-none ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {item.value}
                </p>
              </div>
            </div>

            {item.url && (
              <div className={`
                p-2 rounded-xl transition-all duration-300
                ${DarkMode ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-gray-50 group-hover:bg-gray-100'}
              `}>
                <ChevronRight
                  size={18}
                  className={`transition-colors ${DarkMode ? 'text-slate-500 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900'}`}
                />
              </div>
            )}
          </div>
        );

        return item.url ? (
          <Link to={item.url} key={i} className="block w-full">
            {CardContent}
          </Link>
        ) : (
          <div key={i} className="w-full">
            {CardContent}
          </div>
        );
      })}
    </div>
  );
};

export default SystemSummary;