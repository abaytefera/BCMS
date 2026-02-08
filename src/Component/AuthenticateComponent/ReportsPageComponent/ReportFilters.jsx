import React from 'react';
import { Filter, Calendar, Layers, CheckCircle2, ChevronDown } from 'lucide-react';

const ReportFilters = ({ filters, setFilters, departments }) => {
  
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

  return (
    <div className="bg-white border border-slate-200 p-7 rounded-[2.5rem] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Filter className="text-blue-600" size={16} />
        </div>
        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
          Query Parameters
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Timeline */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Timeline</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              name="period"
              value={filters.period}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 outline-none focus:border-blue-500/50 appearance-none font-bold cursor-pointer transition-all"
            >
              <option value="">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={12} />
          </div>
        </div>

        {/* Lifecycle */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Lifecycle</label>
          <div className="relative group">
            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 outline-none focus:border-blue-500/50 appearance-none font-bold cursor-pointer transition-all"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
              <option value="OVERDUE">Overdue</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={12} />
          </div>
        </div>

        {/* Organization */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Organization</label>
          <div className="relative group">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              name="department"
              value={filters.department}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 outline-none focus:border-blue-500/50 appearance-none font-bold cursor-pointer transition-all"
            >
              <option value="">All Departments</option>
              {departments && departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={12} />
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button 
            type="button"
            onClick={handleReset}
            className="w-full py-3.5 bg-textColor text-white font-black text-[10px] tracking-widest rounded-xl  transition-all active:scale-[0.98] shadow-md shadow-slate-200"
          >
            CLEAR FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;