import React from 'react';
import { Eye, PlayCircle, CheckCircle, XCircle, AlertTriangle, MoreHorizontal, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComplaintRow = ({ complaint }) => {
  const navigate = useNavigate();

  // Data mapping
  const name = complaint?.citizen_name || "Unknown Citizen";
  const phoneNumber = complaint?.phone_number || "No Number";
  const trackingId = complaint?.ref_number || complaint?.id || "N/A";
  const status = complaint?.status?.toUpperCase() || "PENDING";

  // DYNAMIC STATUS COLORS
  const getStatusStyle = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return {
          pill: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'RESOLVED':
        return {
          pill: 'bg-green-100 text-green-800 border-green-200',
          dot: 'bg-green-600'
        };
      case 'REJECTED':
        return {
          pill: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-600'
        };
      case 'OVERDUE':
        return {
          pill: 'bg-red-100 text-red-900 border-red-200 animate-pulse',
          dot: 'bg-red-600'
        };
      default: // PENDING
        return {
          pill: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-500'
        };
    }
  };

  const style = getStatusStyle(status);

  return (
    <tr 
      onClick={() => navigate(`/DetailList/${complaint?._id || complaint?.id}`)} 
      className="group hover:bg-slate-50 border-b border-slate-100 transition-colors cursor-pointer"
    >
      {/* TRACKING ID */}
      <td className="px-8 py-5">
        <span className="text-[11px] font-bold text-slate-400 font-mono">
          #{trackingId}
        </span>
      </td>

      {/* CITIZEN INFO (GREEN AVATAR) */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-textColor text-white flex items-center justify-center text-xs font-black shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-none mb-1 capitalize">
              {name}
            </p>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Phone size={10} /> {phoneNumber}
            </p>
          </div>
        </div>
      </td>

      {/* DYNAMIC STATUS PILL */}
      <td className="px-8 py-5">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.pill}`}>
          <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
          {status.replace('_', ' ')}
        </span>
      </td>

      {/* ACTION (GREEN OPEN BUTTON) */}
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/DetailList/${complaint?._id || complaint?.id}`);
            }}
            className="flex items-center gap-2 px-6 py-2.5   text-black font-bold rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md hover:shadow-green-200"
          >
            <Eye size={14} />
           
          </button>

          
        </div>
      </td>
    </tr>
  );
};

export default ComplaintRow;