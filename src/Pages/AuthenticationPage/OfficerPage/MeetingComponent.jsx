import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, User, CheckCircle, 
  XCircle, Ban, Edit3, X, Info, ChevronRight 
} from 'lucide-react';

const MeetingComponent = ({
  complaint, commitText, setCommitText,
  selectedExecutive, setSelectedExecutive, activeManager,
  handleApproveMeeting, handleRejectMeeting, userRole, scheduledDate,
  setScheduledDate, scheduledTime, setScheduledTime, durationMinutes,
  setDurationMinutes, outcome, setOutcome, outcomeNotes, setOutcomeNotes,
  handleCompleteMeeting, handleCancelMeeting, location, setLocation, handleScheduleMeeting
}) => {
  
  // Local state to toggle the "Change Day/Reschedule" form
  const [isRescheduling, setIsRescheduling] = useState(false);

  const meeting = complaint?.Meeting;

  // Sync local form state with existing meeting data when rescheduling starts
  useEffect(() => {
    if (isRescheduling && meeting) {
      setScheduledDate(meeting.scheduledDate || "");
      setScheduledTime(meeting.scheduledTime || "");
      setDurationMinutes(meeting.durationMinutes || "");
      setLocation(meeting.location || "");
    }
  }, [isRescheduling, meeting, setScheduledDate, setScheduledTime, setDurationMinutes, setLocation]);

  // Helper to find the Executive's Name
  const assignedManager = activeManager?.find(m => m.id === meeting?.assignedExecutive);

  if (!meeting) return null;

  return (
    <div className="w-full space-y-4 font-sans">
      
      {/* --- 1. PENDING STATE (Supervisor Actions) --- */}
      {meeting.status === "PENDING" && userRole === "SUPERVISOR" && (
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Info size={18} className="text-blue-500" />
            <h3>Review Meeting Request</h3>
          </div>
          <textarea
            placeholder="Add a comment or rejection reason..."
            value={commitText}
            onChange={(e) => setCommitText(e.target.value)}
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            rows={3}
          />
          <select
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
            className="w-full border p-3 rounded-xl bg-white text-sm"
          >
            <option value="">Assign to Executive Manager</option>
            {activeManager?.map((m) => (
              <option key={m.id} value={m.id}>{m.username}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleApproveMeeting} className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95">
              Approve
            </button>
            <button onClick={handleRejectMeeting} className="bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* --- 2. APPROVED STATE (Initial Scheduling) --- */}
      {meeting.status === "APPROVED" && (userRole === "MANAGER" || userRole === "SECRETARY" || userRole === "SUPERVISOR") && (
        <div className="space-y-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
            <Calendar size={18} /> <span>Set Meeting Schedule</span>
          </div>
          {(userRole === "MANAGER" || userRole === "SECRETARY") ? (
            <>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full border p-3 rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full border p-3 rounded-xl" />
                <input type="number" placeholder="Min" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className="w-full border p-3 rounded-xl" />
              </div>
              <input placeholder="Location (Room/Link)" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-3 rounded-xl" />
              <button onClick={handleScheduleMeeting} className="w-full bg-primBtn text-white py-3 rounded-xl font-bold  transition-all">
                Confirm Schedule
              </button>
            </>
          ) : (
            <p className="text-sm text-blue-600 italic">Awaiting Manager/Secretary to set the date.</p>
          )}
        </div>
      )}

      {/* --- 3. SCHEDULED STATE (Info + Reschedule/Cancel/Complete) --- */}
      {meeting.status === "SCHEDULED" && (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
             <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">SCHEDULED</span>
             {(userRole === "MANAGER" || userRole === "SECRETARY") && !isRescheduling && (
               <button 
                onClick={() => setIsRescheduling(true)}
                className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
               >
                 <Edit3 size={14} /> Change Day
               </button>
             )}
          </div>
          
          {isRescheduling ? (
            /* --- RESCHEDULE FORM --- */
            <div className="space-y-3 p-4 bg-amber-50 rounded-xl border border-amber-100 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-amber-800 font-bold text-sm">Update Schedule</h4>
                <button onClick={() => setIsRescheduling(false)} className="text-amber-800 hover:bg-amber-100 p-1 rounded-full"><X size={18} /></button>
              </div>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full border p-3 rounded-xl bg-white text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full border p-3 rounded-xl bg-white text-sm" />
                <input type="number" placeholder="Min" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className="w-full border p-3 rounded-xl bg-white text-sm" />
              </div>
              <input placeholder="Update Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-3 rounded-xl bg-white text-sm" />
              <button 
                onClick={() => { handleScheduleMeeting(); setIsRescheduling(false); }} 
                className="w-full bg-amber-600 text-white py-2 rounded-xl font-bold hover:bg-amber-700 transition-all text-sm"
              >
                Save Changes
              </button>
            </div>
          ) : (
            /* --- MEETING DETAILS VIEW --- */
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Calendar size={16}/></div>
                <span className="font-semibold text-sm">{meeting.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Clock size={16}/></div>
                <span className="font-semibold text-sm">{meeting.scheduledTime} ({meeting.durationMinutes} min)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 col-span-full">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><MapPin size={16}/></div>
                <span className="font-semibold text-sm">{meeting.location || "Office Main Hall"}</span>
              </div>
            </div>
          )}

          {/* Manager/Secretary Completion & Cancel Actions */}
          {(userRole === "MANAGER" || userRole === "SECRETARY") && !isRescheduling && (
            <div className="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-3">
              <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50 text-sm">
                <option value="">Select Meeting Outcome</option>
                <option value="RESOLVED">✅ Resolved</option>
                <option value="FOLLOW_UP_REQUIRED">⚠️ Unresolved / Follow-up</option>
              </select>
              <textarea 
                placeholder="Final notes on the meeting outcome..." 
                value={outcomeNotes} 
                onChange={(e) => setOutcomeNotes(e.target.value)} 
                className="w-full border p-3 rounded-xl text-sm" 
              />
              <div className="flex gap-2">
                <button onClick={handleCompleteMeeting} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all">
                  Complete Meeting
                </button>
                
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- 4. TERMINAL STATES --- */}
      {meeting.status === "REJECTED" && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
          <XCircle className="text-rose-500 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-rose-800">Request Rejected</h4>
            <p className="text-sm text-rose-600">{meeting.rejectionReason || "No reason provided."}</p>
          </div>
        </div>
      )}

      {meeting.status === "COMPLETED" && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="text-emerald-500" size={24} />
            <h4 className="font-bold text-emerald-800">Meeting Successfully Completed</h4>
          </div>
          <div className="space-y-2 p-3 bg-white/60 rounded-xl border border-emerald-100 text-xs text-emerald-800">
            <div className="flex justify-between border-b border-emerald-100 pb-1">
              <span className="font-bold uppercase tracking-tighter">Outcome</span>
              <span className="font-mono">{meeting.outcome}</span>
            </div>
            {meeting.outcomeNotes && (
              <div className="pt-1">
                <strong>Notes:</strong> {meeting.outcomeNotes}
              </div>
            )}
          </div>
        </div>
      )}

      {meeting.status === "CANCELLED" && (
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex items-center gap-3 opacity-60">
          <Ban className="text-slate-400" size={24} />
          <h4 className="font-bold text-slate-500 uppercase tracking-widest text-sm">Meeting Cancelled</h4>
        </div>
      )}

      {/* --- 5. ASSIGNED FOOTER --- */}
      {meeting.assignedExecutive && meeting.status !== "PENDING" && (
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 w-fit rounded-lg text-[10px] text-slate-500 font-medium">
          <User size={12} />
          <span>Assigned To: <strong className="text-slate-700 uppercase">{assignedManager?.username || `ID: ${meeting.assignedExecutive}`}</strong></span>
        </div>
      )}
    </div>
  );
}

export default MeetingComponent;