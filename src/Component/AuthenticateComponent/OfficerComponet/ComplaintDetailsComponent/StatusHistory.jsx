import React from 'react';
import { useSelector } from 'react-redux';
import { Clock, History } from "lucide-react";

const StatusHistory = ({ history = [] }) => {
  const { DarkMode } = useSelector((state) => state.webState);

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 opacity-40">
        <History size={32} className="mb-2" />
        <p className={`text-xs font-semibold capitalize ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          No history recorded
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {history.map((log, index) => {
        const status = log.toStatus || log.status || "unknown";
        const isLatest = index === 0;

        return (
          <div key={log.id || index} className="group relative flex gap-6">
            
            {/* Professional Timeline Connector */}
            {index !== history.length - 1 && (
              <div 
                className={`absolute left-[11px] top-8 w-[2px] h-[calc(100%+24px)] transition-colors duration-300
                  ${DarkMode ? 'bg-slate-800' : 'bg-slate-100'} 
                  ${isLatest ? (DarkMode ? 'bg-indigo-500/30' : 'bg-indigo-100') : ''}
                `} 
              />
            )}

            {/* Status Indicator Dot */}
            <div className="relative">
              <div 
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isLatest 
                    ? (DarkMode ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-indigo-600 bg-white shadow-lg shadow-indigo-100') 
                    : (DarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white')
                  }
                `}
              >
                <div 
                  className={`w-2 h-2 rounded-full transition-colors 
                    ${isLatest ? (DarkMode ? 'bg-indigo-400' : 'bg-indigo-600') : (DarkMode ? 'bg-slate-700' : 'bg-slate-300')}
                  `} 
                />
              </div>
            </div>

            {/* Content Card Style */}
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <h4 
                  className={`text-[13px] font-bold capitalize tracking-tight transition-colors
                    ${isLatest 
                      ? (DarkMode ? 'text-indigo-400' : 'text-indigo-700') 
                      : (DarkMode ? 'text-slate-200' : 'text-slate-800')
                    }
                  `}
                >
                  {status.replace(/_/g, ' ').toLowerCase()}
                </h4>

                <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Clock size={12} className={isLatest && !DarkMode ? 'text-indigo-500' : ''} />
                  <span>
                    {log.createdAt 
                      ? new Date(log.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) 
                      : "N/A"}
                  </span>
                </div>
              </div>

              {log.comment && (
                <div 
                  className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all
                    ${DarkMode 
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400 group-hover:border-slate-700' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-sm'
                    }
                  `}
                >
                  <span className="capitalize">{log.comment.toLowerCase()}</span>
                </div>
              )}
              
              {/* Optional: Changed By Tag */}
              {log.changed_by_name && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${DarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  <span className={`text-[10px] font-semibold capitalize ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    Updated by {log.changed_by_name.toLowerCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusHistory;