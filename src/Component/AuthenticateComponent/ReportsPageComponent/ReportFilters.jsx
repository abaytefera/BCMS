import React from 'react';
import { useSelector } from 'react-redux';
import { Filter, Calendar, Layers, CheckCircle2, ChevronDown, RotateCcw } from 'lucide-react';

const ReportFilters = ({ filters, setFilters, departments }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilters({ period: '', department: '', status: '' });
  };

  // --- SaaS Professional Styles using your Theme Variables ---
  const selectStyles = `
    w-full pl-11 pr-10 py-3.5 text-xs font-black outline-none appearance-none cursor-pointer transition-all rounded-2xl border
    ${DarkMode 
      ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-primBtn focus:ring-1 focus:ring-primBtn/20' 
      : 'bg-white border-slate-200 text-slate-900 focus:border-primBtn focus:ring-4 focus:ring-primBtn/5'}
  `;

  const labelStyles = `text-[10px] font-black ml-2 mb-2 block tracking-widest capitalize ${
    DarkMode ? 'text-slate-500' : 'text-slate-400'
  }`;

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
      DarkMode 
        ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/50' 
        : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
    }`}>
      
      {/* Header Section with your textColor variable */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2.5 rounded-xl ${DarkMode ? 'bg-textColor/10' : 'bg-textColor/5'}`}>
          <Filter className="text-textColor" size={18} strokeWidth={3} />
        </div>
        <h3 className={`text-[11px] font-black capitalize tracking-[0.2em] ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
          Query parameters
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Timeline - Styled with primBtn */}
        <div>
          <label className={labelStyles}>Timeline</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primBtn" size={16} strokeWidth={2.5} />
            <select name="period" value={filters.period} onChange={handleChange} className={selectStyles}>
              <option value="">All time</option>
              <option value="Today">Today</option>
              <option value="This Week">This week</option>
              <option value="This Month">This month</option>
              <option value="This Year">This year</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Lifecycle - High Contrast Emerald/Amber */}
        <div>
          <label className={labelStyles}>Lifecycle</label>
          <div className="relative group">
            <CheckCircle2 className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              filters.status === 'RESOLVED' ? 'text-emerald-500' : 'text-amber-500'
            }`} size={16} strokeWidth={2.5} />
            <select name="status" value={filters.status} onChange={handleChange} className={selectStyles}>
              <option value="">All statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Organization - Using primBtn theme */}
        <div>
          <label className={labelStyles}>Organization</label>
          <div className="relative group">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-primBtn" size={16} strokeWidth={2.5} />
            <select name="department" value={filters.department} onChange={handleChange} className={selectStyles}>
              <option value="">All departments</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Reset Button - primBtn Contrast */}
        <div className="flex items-end">
          <button 
            type="button"
            onClick={handleReset}
            className="w-full py-4 flex items-center justify-center gap-2 rounded-2xl font-black text-[10px] tracking-widest transition-all active:scale-95 bg-primBtn text-white hover:brightness-110 shadow-lg shadow-primBtn/20"
          >
            <RotateCcw size={14} strokeWidth={3} />
            CLEAR FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;