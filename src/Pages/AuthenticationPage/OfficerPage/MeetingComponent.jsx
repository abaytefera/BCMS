import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Calendar, Clock, MapPin, User, CheckCircle, 
  XCircle, Ban, Edit3, X, Info, ChevronRight,
  ShieldCheck, AlertCircle, FileText
} from 'lucide-react';

const MeetingComponent = ({
  complaint, commitText, setCommitText,
  selectedExecutive, setSelectedExecutive, activeManager,
  handleApproveMeeting, handleRejectMeeting, userRole, scheduledDate,
  setScheduledDate, scheduledTime, setScheduledTime, durationMinutes,
  setDurationMinutes, outcome, setOutcome, outcomeNotes, setOutcomeNotes,
  handleCompleteMeeting, handleCancelMeeting, location, setLocation, handleScheduleMeeting
}) => {
  const { DarkMode } = useSelector((state) => state.webState);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const meeting = complaint?.Meeting;

  useEffect(() => {
    if (isRescheduling && meeting) {
      setScheduledDate(meeting.scheduledDate || "");
      setScheduledTime(meeting.scheduledTime || "");
      setDurationMinutes(meeting.endingdate || "");
      setLocation(meeting.location || "");
    }
  }, [isRescheduling, meeting, setScheduledDate, setScheduledTime, setDurationMinutes, setLocation]);

  const assignedManager = activeManager?.find(m => m.id === meeting?.assignedExecutive);

  if (!meeting) return null;

  // Reusable styles for inputs
  const inputClasses = `w-full p-3.5 rounded-2xl text-sm font-medium border-2 outline-none transition-all ${
    DarkMode 
    ? 'bg-slate-900 border-slate-800 focus:border-indigo-500 text-slate-200' 
    : 'bg-white border-slate-100 focus:border-textColor text-slate-800 shadow-sm'
  }`;

  return (
    <div className={`w-full space-y-6 font-sans ${DarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
      
      {/* --- 1. PENDING STATE --- */}
      {meeting.status === "PENDING" && userRole === "SUPERVISOR" && (
        <div className={`space-y-5 p-6 rounded-3xl border-2 animate-in fade-in duration-500 ${
          DarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${DarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-base capitalize">Review meeting request</h3>
          </div>
          
          <textarea
            placeholder="Add a professional remark or reason..."
            value={commitText}
            onChange={(e) => setCommitText(e.target.value)}
            className={`${inputClasses} min-h-[100px] resize-none`}
          />

          <select
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
            className={inputClasses}
          >
            <option value="">Select executive manager</option>
            {activeManager?.map((m) => (
              <option key={m.id} value={m.id}>{m.username.toLowerCase()}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleApproveMeeting} className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-600/20 capitalize">
              Approve
            </button>
            <button onClick={handleRejectMeeting} className="bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-rose-500/20 capitalize">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* --- 2. APPROVED STATE (Scheduling) --- */}
      {meeting.status === "APPROVED" && (userRole === "MANAGER" || userRole === "SECRETARY" || userRole === "SUPERVISOR") && (
        <div className={`space-y-5 p-6 rounded-3xl border-2 ${
          DarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50/30 border-indigo-100'
        }`}>
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold">
            <Calendar size={20} /> <span className="capitalize">Schedule meeting details</span>
          </div>
          {(userRole === "MANAGER" || userRole === "SECRETARY") ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 ml-1 capitalize">Meeting date</label>
                  <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputClasses} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 ml-1 capitalize">Start time</label>
                  <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputClasses} />
                </div>
              </div>
              <input placeholder="Location (Room, link or office address)" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} />
              <button onClick={handleScheduleMeeting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 capitalize">
                Confirm schedule
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border border-dashed text-center ${DarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <p className="text-sm text-slate-500 italic capitalize">Waiting for manager to finalize the schedule.</p>
            </div>
          )}
        </div>
      )}

      {/* --- 3. SCHEDULED STATE --- */}
      {meeting.status === "SCHEDULED" && (
        <div className={`p-6 rounded-3xl border-2 shadow-sm space-y-6 ${
          DarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex justify-between items-center">
             <span className="bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase">
               Scheduled
             </span>
             {(userRole === "MANAGER" || userRole === "SECRETARY") && !isRescheduling && (
               <button 
                onClick={() => setIsRescheduling(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  DarkMode ? 'hover:bg-slate-900 text-indigo-400' : 'hover:bg-indigo-50 text-indigo-600'
                }`}
               >
                 <Edit3 size={14} /> <span className="capitalize">Reschedule</span>
               </button>
             )}
          </div>
          
          {isRescheduling ? (
            <div className={`space-y-4 p-5 rounded-2xl border animate-in slide-in-from-top-2 duration-300 ${
              DarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'
            }`}>
              <div className="flex justify-between items-center">
                <h4 className="text-amber-600 font-bold text-sm capitalize">Update schedule</h4>
                <button onClick={() => setIsRescheduling(false)} className="text-amber-600 p-1.5 rounded-full hover:bg-amber-100"><X size={18} /></button>
              </div>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputClasses} />
              <div className="grid grid-cols-2 gap-3">
                <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputClasses} />
                <input type="time" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className={inputClasses} />
              </div>
              <input placeholder="Update location" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} />
              <button 
                onClick={() => { handleScheduleMeeting(); setIsRescheduling(false); }} 
                className="w-full bg-amber-600 text-white py-3 rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm capitalize"
              >
                Save changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><Calendar size={18}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Date</p>
                  <span className="font-bold text-sm">{meeting.scheduledDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><Clock size={18}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Time</p>
                  <span className="font-bold text-sm">{meeting.scheduledTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 col-span-full border-t pt-4 dark:border-slate-800">
                <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><MapPin size={18}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Location</p>
                  <span className="font-bold text-sm capitalize">{meeting.location?.toLowerCase() || "office main hall"}</span>
                </div>
              </div>
            </div>
          )}

          {(userRole === "MANAGER" || userRole === "SECRETARY") && !isRescheduling && (
            <div className={`mt-6 pt-6 border-t-2 border-dashed space-y-4 ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 ml-1 capitalize">Meeting outcome</label>
                <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className={inputClasses}>
                  <option value="">Select meeting outcome</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="FOLLOW_UP_REQUIRED">Follow-up required</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 ml-1 capitalize">Final notes</label>
                <textarea 
                  placeholder="Summarize the meeting resolution..." 
                  value={outcomeNotes} 
                  onChange={(e) => setOutcomeNotes(e.target.value)} 
                  className={`${inputClasses} min-h-[100px]`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 ml-1 capitalize">Meeting ending date</label>
                <input type="date" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className={inputClasses} />
              </div>
              <button onClick={handleCompleteMeeting} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-xl shadow-emerald-600/20 capitalize">
                Complete meeting session
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- 4. TERMINAL STATES --- */}
      {meeting.status === "REJECTED" && (
        <div className={`p-6 rounded-3xl border-2 flex items-start gap-4 ${
          DarkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100'
        }`}>
          <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20"><XCircle size={24} /></div>
          <div>
            <h4 className="font-bold text-rose-600 capitalize text-lg">Request rejected</h4>
            <p className="text-sm text-slate-500 mt-1 capitalize leading-relaxed">{meeting.rejectionReason?.toLowerCase() || "no reason provided."}</p>
          </div>
        </div>
      )}

      {meeting.status === "COMPLETED" && (
        <div className={`p-6 rounded-3xl border-2 shadow-sm ${
          DarkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50/50 border-emerald-100'
        }`}>
          <div className="flex items-center gap-4 mb-5">
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"><CheckCircle size={24} /></div>
            <h4 className="font-bold text-emerald-600 capitalize text-lg">Meeting completed</h4>
          </div>
          <div className={`space-y-4 p-5 rounded-2xl border ${DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-emerald-50'}`}>
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 capitalize">Outcome</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${DarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                {meeting.outcome?.toLowerCase() || 'unknown'}
              </span>
            </div>
            {meeting.outcomeNotes && (
              <div className="pt-1">
                <p className="text-[11px] font-bold text-slate-400 capitalize mb-1">Resolution notes</p>
                <p className="text-sm leading-relaxed capitalize">{meeting.outcomeNotes.toLowerCase()}</p>
                <div className={`mt-3 pt-3 border-t flex justify-between items-center dark:border-slate-800`}>
                  <span className="text-[10px] font-bold text-slate-400 capitalize">Closed on</span>
                  <span className="text-[11px] font-bold">{meeting.endMeeting || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- 5. ASSIGNED FOOTER --- */}
      {meeting.assignedExecutive && meeting.status !== "PENDING" && (
        <div className={`flex items-center gap-3 px-4 py-3 w-fit rounded-2xl border transition-all ${
          DarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className={`p-1.5 rounded-lg ${DarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}>
            <User size={14} />
          </div>
          <span className="text-[11px] font-medium flex items-center gap-1.5">
            <span className="capitalize">Assigned manager:</span>
            <strong className={`capitalize ${DarkMode ? 'text-indigo-400' : 'text-slate-800'}`}>
              {assignedManager?.username?.toLowerCase() || `ID: ${meeting.assignedExecutive}`}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}

export default MeetingComponent;