import React from 'react';
import { useSelector } from 'react-redux';
import { FileText, Table, Printer, Share2 } from 'lucide-react';

const ExportPanel = () => {
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Common button styles for a unified SaaS look
  const btnBase = "flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-[11px] capitalize tracking-wide transition-all duration-300 active:scale-95 shadow-sm hover:shadow-lg";

  return (
    <div className="flex flex-wrap gap-4 mb-10">
      {/* PDF Export - High Contrast Rose */}
      <button className={`${btnBase} ${
        DarkMode 
          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-600' 
          : 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600'
      }`}>
        <FileText size={18} strokeWidth={2.5} />
        <span>Export pdf</span>
      </button>
      
      {/* Excel Download - High Contrast Emerald */}
      <button className={`${btnBase} ${
        DarkMode 
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' 
          : 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
      }`}>
        <Table size={18} strokeWidth={2.5} />
        <span>Download excel</span>
      </button>

      {/* Print Table - Neutral SaaS Style */}
      <button className={`${btnBase} group ${
        DarkMode 
          ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-white hover:text-slate-900 hover:border-white' 
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900'
      }`}>
        <Printer size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
        <span>Print table</span>
      </button>

      {/* Share Feature - Accent Style */}
      <button className={`${btnBase} ${
        DarkMode 
          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600' 
          : 'bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'
      }`}>
        <Share2 size={18} strokeWidth={2.5} />
        <span>Share report</span>
      </button>
    </div>
  );
};

export default ExportPanel;