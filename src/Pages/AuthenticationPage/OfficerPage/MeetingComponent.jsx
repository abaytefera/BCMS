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

  // Professional SaaS Input Styles
  const inputClasses = `w-full p-4 rounded-2xl text-[13px] font-medium border-2 outline-none transition-all duration-300 ${
    DarkMode 
    ? 'bg-slate-900/50 border-slate-800 focus:border-primBtn/50 text-slate-200 placeholder:text-slate-600 focus:ring-4 focus:ring-primBtn/5' 
    : 'bg-white border-slate-100 focus:border-primBtn text-slate-800 shadow-sm placeholder:text-slate-400 focus:ring-4 focus:ring-primBtn/5'
  }`;

  return (
    <div className={`w-full space-y-6 font-sans transition-colors duration-500 ${DarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
      
      {/* --- 1. PENDING STATE --- */}
      {meeting.status === "PENDING" && userRole === "SUPERVISOR" && (
        <div className={`space-y-5 p-7 rounded-[2.5rem] border-2 animate-in fade-in slide-in-from-bottom-2 duration-500 ${
          DarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-primBtn/10 text-primBtn' : 'bg-white text-primBtn shadow-sm'}`}>
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-lg capitalize tracking-tight leading-none">Review meeting request</h3>
              <p className="text-[11px] font-bold text-slate-500 mt-1 capitalize">Supervisor action required</p>
            </div>
          </div>
          
          <textarea
            placeholder="add a professional remark or reason..."
            value={commitText}
            onChange={(e) => setCommitText(e.target.value)}
            className={`${inputClasses} min-h-[110px] resize-none`}
          />

          <select
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
            className={inputClasses}
          >
            <option value="">select executive manager</option>
            {activeManager?.map((m) => (
              <option key={m.id} value={m.id}>{m.username.toLowerCase()}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button onClick={handleApproveMeeting} className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-emerald-600/20 capitalize text-sm">
              approve request
            </button>
            <button onClick={handleRejectMeeting} className="bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-rose-500/20 capitalize text-sm">
              reject request
            </button>
          </div>
        </div>
      )}

      {/* --- 2. APPROVED STATE --- */}
      {meeting.status === "APPROVED" && (userRole === "MANAGER" || userRole === "SECRETARY" || userRole === "SUPERVISOR") && (
        <div className={`space-y-5 p-7 rounded-[2.5rem] border-2 ${
          DarkMode ? 'bg-primBtn/5 border-primBtn/10' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-3 text-primBtn font-black">
            <Calendar size={22} strokeWidth={2.5} /> <span className="capitalize text-lg tracking-tight">Schedule meeting details</span>
          </div>
          {(userRole === "MANAGER" || userRole === "SECRETARY") ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 ml-1 capitalize tracking-wider">meeting date</label>
                  <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputClasses} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 ml-1 capitalize tracking-wider">start time</label>
                  <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputClasses} />
                </div>
              </div>
              <input placeholder="location (room, link or office address)" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} />
              <button onClick={handleScheduleMeeting} className="w-full bg-primBtn hover:brightness-110 text-white py-4.5 rounded-2xl font-black transition-all shadow-2xl shadow-primBtn/30 capitalize text-sm">
                confirm schedule
              </button>
            </div>
          ) : (
            <div className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center ${DarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
               <Clock className="text-slate-400 mb-3" size={32} strokeWidth={1.5} />
               <p className="text-sm text-slate-500 font-bold capitalize">waiting for manager to finalize the schedule</p>
            </div>
          )}
        </div>
      )}

      {/* --- 3. SCHEDULED STATE --- */}
      {meeting.status === "SCHEDULED" && (
        <div className={`p-8 rounded-[3rem] border-2 transition-all duration-500 ${
          DarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-50 shadow-xl shadow-slate-200/50'
        }`}>
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primBtn/10 border border-primBtn/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primBtn animate-pulse" />
                <span className="text-primBtn text-[11px] font-black capitalize tracking-tight">Scheduled</span>
             </div>
             {(userRole === "MANAGER" || userRole === "SECRETARY") && !isRescheduling && (
               <button 
                onClick={() => setIsRescheduling(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-black transition-all active:scale-95 ${
                  DarkMode ? 'bg-slate-800 hover:bg-slate-700 text-primBtn' : 'bg-slate-50 hover:bg-slate-100 text-primBtn'
                }`}
               >
                 <Edit3 size={16} strokeWidth={2.5} /> <span className="capitalize">reschedule</span>
               </button>
             )}
          </div>
          
          {isRescheduling ? (
            <div className={`space-y-4 p-6 rounded-[2rem] border-2 animate-in zoom-in-95 duration-300 ${
              DarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-amber-600 font-black text-sm capitalize tracking-tight">Update schedule details</h4>
                <button onClick={() => setIsRescheduling(false)} className="text-amber-600 p-2 rounded-full hover:bg-amber-100 transition-colors"><X size={20} strokeWidth={3}/></button>
              </div>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputClasses} />
              <div className="grid grid-cols-2 gap-3">
                <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputClasses} />
                <input type="time" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className={inputClasses} />
              </div>
              <input placeholder="update location" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} />
              <button 
                onClick={() => { handleScheduleMeeting(); setIsRescheduling(false); }} 
                className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black hover:bg-amber-700 transition-all text-sm capitalize shadow-lg shadow-amber-600/20"
              >
                save changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-[1.25rem] ${DarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><Calendar size={22} strokeWidth={2}/></div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 capitalize mb-1">Date</p>
                  <span className="font-black text-[16px] tracking-tight">{meeting.scheduledDate}</span>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-[1.25rem] ${DarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><Clock size={22} strokeWidth={2}/></div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 capitalize mb-1">Time</p>
                  <span className="font-black text-[16px] tracking-tight">{meeting.scheduledTime}</span>
                </div>
              </div>
              <div className="flex items-start gap-5 col-span-full border-t-2 border-dashed pt-6 dark:border-slate-800">
                <div className={`p-4 rounded-[1.25rem] ${DarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><MapPin size={22} strokeWidth={2}/></div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 capitalize mb-1">Location</p>
                  <span className="font-black text-[16px] tracking-tight capitalize">{meeting.location?.toLowerCase() || "office main hall"}</span>
                </div>
              </div>
            </div>
          )}

          {(userRole === "MANAGER" || userRole === "SECRETARY") && !isRescheduling && (
            <div className={`mt-10 pt-8 border-t-2 border-dashed space-y-6 ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 ml-1 capitalize tracking-widest">meeting outcome</label>
                <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className={inputClasses}>
                  <option value="">select meeting outcome</option>
                  <option value="RESOLVED">resolved</option>
                  <option value="FOLLOW_UP_REQUIRED">follow-up required</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 ml-1 capitalize tracking-widest">final notes</label>
                <textarea 
                  placeholder="summarize the meeting resolution..." 
                  value={outcomeNotes} 
                  onChange={(e) => setOutcomeNotes(e.target.value)} 
                  className={`${inputClasses} min-h-[120px]`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 ml-1 capitalize tracking-widest">meeting ending date</label>
                <input type="date" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className={inputClasses} />
              </div>
              <button onClick={handleCompleteMeeting} className="w-full bg-primBtn text-white py-4.5 rounded-2xl font-black  active:scale-95 transition-all shadow-2xl shadow-emerald-600/30 capitalize text-[15px]">
                complete meeting session
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- 4. TERMINAL STATES --- */}
      {meeting.status === "REJECTED" && (
        <div className={`p-8 rounded-[2.5rem] border-2 flex items-start gap-6 ${
          DarkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100'
        }`}>
          <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-500/30"><XCircle size={28} strokeWidth={2.5} /></div>
          <div>
            <h4 className="font-black text-rose-600 capitalize text-xl tracking-tight">request rejected</h4>
            <p className="text-sm font-medium text-slate-500 mt-2 capitalize leading-relaxed">{meeting.rejectionReason?.toLowerCase() || "no reason provided."}</p>
          </div>
        </div>
      )}

      {meeting.status === "COMPLETED" && (
        <div className={`p-8 rounded-[3rem] border-2 shadow-sm ${
          DarkMode ? 'bg-slate-950 border-slate-800' : 'bg-emerald-50/30 border-emerald-100'
        }`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/30"><CheckCircle size={28} strokeWidth={2.5} /></div>
            <h4 className="font-black text-emerald-600 capitalize text-xl tracking-tight">meeting completed</h4>
          </div>
          <div className={`space-y-6 p-7 rounded-[2rem] border-2 ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-inner' : 'bg-white border-emerald-50 shadow-sm'}`}>
            <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
              <span className="text-[11px] font-black text-slate-400 capitalize tracking-widest">outcome</span>
              <span className={`px-4 py-1.5 rounded-xl text-[13px] font-black capitalize ${DarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                {meeting.outcome?.toLowerCase() || 'unknown'}
              </span>
            </div>
            {meeting.outcomeNotes && (
              <div className="pt-2">
                <p className="text-[11px] font-black text-slate-400 capitalize mb-2 tracking-widest">resolution notes</p>
                <p className="text-[15px] font-medium leading-relaxed capitalize text-slate-500">{meeting.outcomeNotes.toLowerCase()}</p>
                <div className="mt-8 pt-4 border-t-2 border-dashed flex justify-between items-center dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 capitalize tracking-widest">closed on</span>
                  <span className="text-xs font-black tracking-tight">{meeting.endMeeting || 'n/a'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- 5. ASSIGNED FOOTER --- */}
      {meeting.assignedExecutive && meeting.status !== "PENDING" && (
        <div className={`flex items-center gap-4 px-6 py-4 w-fit rounded-[1.5rem] border-2 transition-all ${
          DarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className={`p-2 rounded-xl ${DarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}>
            <User size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold flex items-center gap-2">
            <span className="capitalize text-slate-500 font-medium">assigned manager:</span>
            <strong className={`capitalize text-[13px] font-black ${DarkMode ? 'text-primBtn' : 'text-slate-800'}`}>
              {assignedManager?.username?.toLowerCase() || `id: ${meeting.assignedExecutive}`}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}

export default MeetingComponent;