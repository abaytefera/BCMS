import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronLeft, RefreshCcw, CheckCircle, Clock, AlertCircle,
  FileText, History, ShieldCheck, Lock,
  Send, Loader2, Mail, Phone, 
  ImageIcon, ExternalLink, Video, Music, FileCode,
  UserPlus, MessageSquare, UserCheck, XCircle
} from "lucide-react";
import { useGetActiveManagerQuery } from "../../../Redux/supervisorApi";
import toast, { Toaster } from "react-hot-toast";
import { complaintApi } from "../../../Redux/complaintApi";
import { toEthiopian } from "ethiopian-date";

import Sidebar from "../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar";
import AuthHeader from "../../../Component/AuthenticateComponent/AuthHeader";
import InfoCard from "../../../Component/AuthenticateComponent/OfficerComponet/ComplaintDetailsComponent/InfoCard";

import AttachmentModal from "./AttachementModel";
import MeetingComponent from "./MeetingComponent";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management from webState and auth
  const { Language, DarkMode } = useSelector((state) => state.webState);
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;

  // API Queries
  const { data: activeManager, isLoading: isLoadingActive, isError: isErrorActive, error: errorActive } = useGetActiveManagerQuery();
  
  const complaintId = useMemo(() => (!isNaN(Number(id)) ? Number(id) : null), [id]);

  const { data: complaint, isLoading, isError, refetch: refetchComplaint } = complaintApi.useGetComplaintByIdQuery(complaintId, { skip: !complaintId });
  const { data: historyLogs, isLoading: isHistoryLoading, refetch: refetchHistory } = complaintApi.useGetComplaintHistoryQuery(complaintId, { skip: !complaintId });
  const { data: internalNotes, refetch: refetchInternalNotes } = complaintApi.useGetInternalNotesQuery({ complaintId }, { skip: !complaintId });

  // Permissions
  const canUpdateStatus = ["SUPERVISOR", "OFFICER", "MANAGER"].includes(userRole);
  const canAddInternalNote = ["SUPERVISOR", "OFFICER", "MANAGER"].includes(userRole);

  // Local State
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [internalNote, setInternalNote] = useState("");
  
  // Meeting Management State
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [commitText, setCommitText] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [location, setLocation] = useState("");
  const [outcome, setOutcome] = useState("");
  const [outcomeNotes, setOutcomeNotes] = useState("");

  // Attachment Modal State
  const [openFileModal, setOpenFileModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // API Mutations
  const [approveMeeting, { isLoading: isApproving, error: approveError }] = complaintApi.useApproveMeetingMutation();
  const [scheduleMeeting, { isLoading: isScheduling, error: scheduleError }] = complaintApi.useScheduleMeetingMutation();
  const [completeMeeting, { isLoading: isCompleting, error: completeError }] = complaintApi.useCompleteMeetingMutation();
  const [cancelMeeting, { isLoading: isCancelling, error: cancelError }] = complaintApi.useCancelMeetingMutation();
  const [updateStatus, { isLoading: isUpdating }] = complaintApi.useUpdateComplaintStatusMutation();
  const [createInternalNote, { isLoading: isCreatingNote }] = complaintApi.useCreateInternalNoteMutation();

  useEffect(() => {
    if (complaint?.status) setSelectedStatus(complaint.status);
  }, [complaint]);

  const formatEthiopianDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const [year, month, day] = toEthiopian(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return `${day}/${month}/${year}`;
  };

  const statusConfig = {
    "SUBMITTED": { label: "Submitted", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: <FileText size={16} /> },
    "UNDER_REVIEW": { label: "Under Review", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", icon: <Clock size={16} /> },
    "ASSIGNED": { label: "Assigned", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", icon: <ShieldCheck size={16} /> },
    "IN_PROGRESS": { label: "In Progress", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: <RefreshCcw size={16} /> },
    "RESOLVED": { label: "Resolved", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: <CheckCircle size={16} /> },
    "CLOSED": { label: "Closed", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200", icon: <History size={16} /> },
    "REJECTED": { label: "Rejected", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", icon: <AlertCircle size={16} /> },
  };

  // Supervisor Meeting Actions
  const handleApproveMeeting = async () => {
    if (!selectedExecutive) return toast.error("Select manager");
    try {
      toast.loading("Approving meeting...", { id: "approve" });
    
      await approveMeeting({
        compileid: complaint.id,
        manager_id: selectedExecutive,
        commit: commitText || "Meeting approved",
        isapprove: true,
        meeting_id: complaint?.Meeting?.id
      }).unwrap();
      toast.success("Meeting approved", { id: "approve" });
      refetchComplaint();
    } catch (err) {
      toast.error(approveError?.data?.message || "Approval failed", { id: "approve" });
    }
  };

  const handleRejectMeeting = async () => {
    if (!commitText.trim()) return toast.error("Rejection reason required");
    try {
      toast.loading("Rejecting meeting...", { id: "reject" });
      await approveMeeting({
        compileid: complaint.id,
        manager_id: null,
        commit: commitText,
        isapprove: false,
        meeting_id: complaint?.Meeting?.id
      }).unwrap();
      toast.success("Meeting rejected", { id: "reject" });
      refetchComplaint();
    } catch (err) {
      toast.error(approveError?.data?.message || "Reject failed", { id: "reject" });
    }
  };

  // Manager Meeting Actions
  const handleScheduleMeeting = async () => {
    
    if (!scheduledDate || !scheduledTime  || !location) {
      return toast.error("Fill all fields");
    }
    try {
      toast.loading("Scheduling meeting...", { id: "schedule" });
      await scheduleMeeting({
        meeting_id: complaint?.Meeting?.id,
        scheduledDate,
        scheduledTime,
        endingdate: scheduledDate,
        location
      }).unwrap();
      toast.success("Meeting scheduled", { id: "schedule" });
      refetchComplaint();
    } catch (err) {
      toast.error(scheduleError?.data?.message || "Schedule failed", { id: "schedule" });
    }
  };

  const handleCompleteMeeting = async () => {
    if (!outcome) return toast.error("Select outcome");
    try {
      toast.loading("Completing meeting...", { id: "complete" });
      await completeMeeting({
        meeting_id: complaint?.Meeting?.id,
        outcome,
        outcomeNotes,
        endMeeting: durationMinutes
      }).unwrap();
      toast.success("Meeting completed", { id: "complete" });
      refetchComplaint();
    } catch (err) {
      toast.error(completeError?.data?.message || "Update failed", { id: "complete" });
    }
  };

  const handleCancelMeeting = async () => {
    try {
      toast.loading("Cancelling meeting...", { id: "cancel" });
      await cancelMeeting({ meeting_id: complaint?.Meeting?.id }).unwrap();
      toast.success("Meeting cancelled", { id: "cancel" });
      refetchComplaint();
    } catch (err) {
      toast.error(cancelError?.data?.message || "Cancel failed", { id: "cancel" });
    }
  };

  const filteredStatusKeys = useMemo(() => {
    const keys = Object.keys(statusConfig);
    return keys.filter((key) => {
      if (key === complaint?.status) return true; 
      if (userRole === "OFFICER") return !["SUBMITTED", "ASSIGNED", "UNDER_REVIEW", "CLOSED"].includes(key);
      if (userRole === "SUPERVISOR") return !["SUBMITTED", "ASSIGNED"].includes(key);
      return true;
    });
  }, [userRole, complaint?.status]);

  const getFileDisplay = (type) => {
    const mime = (type || "").toLowerCase();
    const parts = mime.includes("/") ? mime.split("/") : ["file", "unknown"];
    if (mime.startsWith("image/")) return { icon: <ImageIcon size={20} className="text-emerald-600" />, label: parts[1] };
    if (mime.startsWith("video/")) return { icon: <Video size={20} className="text-rose-600" />, label: parts[1] };
    if (mime.startsWith("audio/")) return { icon: <Music size={20} className="text-amber-600" />, label: parts[1] };
    if (mime.includes("pdf")) return { icon: <FileText size={20} className="text-red-600" />, label: "PDF" };
    return { icon: <FileCode size={20} className="text-blue-600" />, label: parts[1] || "FILE" };
  };

  const handleStatusUpdate = async () => {
    if (!statusComment.trim()) return toast.error("Please provide a reason for this status change.");
    try {
      await toast.promise(
        updateStatus({ id: complaintId, status: selectedStatus, comment: statusComment }).unwrap(),
        { 
          loading: "Updating status...", 
          success: "Case status successfully updated", 
          error: (err) => err?.data?.message || "Invalid status transition" 
        }
      );
      setStatusComment("");
      refetchComplaint();
      refetchHistory();
    } catch (err) { console.error("Update failed:", err); }
  };

  const handleAddInternalNote = async () => {
    if (!internalNote.trim()) return toast.error("Note cannot be empty.");
    try {
      await toast.promise(
        createInternalNote({ complaintId, note: internalNote }).unwrap(),
        { loading: "Posting note...", success: "Internal note added", error: "Failed to post note" }
      );
      setInternalNote("");
      refetchInternalNotes();
    } catch (err) { console.error(err); }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-textColor" size={40} /></div>;
  if (isError || !complaint) return <div className="h-screen flex items-center justify-center font-bold text-rose-500">Complaint not found or API Error.</div>;

  const activeConfig = statusConfig[complaint?.status] || statusConfig["SUBMITTED"];

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
      <Toaster position="top-right" />
      <Sidebar role={userRole?.toLowerCase() || "officer"} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className="flex-grow pt-32 pb-20 px-6 lg:px-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => navigate(-1)} 
                  className={`p-3 border rounded-2xl transition-all shadow-sm hover:scale-105 ${DarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <ChevronLeft size={22} />
                </button>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{complaint.ref_number || "REF-NULL"}</h1>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${complaint.priority === 'HIGH' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                      {complaint.priority || "NORMAL"} PRIORITY
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest opacity-50`}>
                      {Language === "AM" ? "የተላከበት ቀን" : "Submitted"}: {formatEthiopianDate(complaint.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                {userRole === "SUPERVISOR" && (
                  <button onClick={() => navigate(`/AssignComplain/${id}`)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-textColor text-white transition-all hover:bg-opacity-90 shadow-lg shadow-textColor/20">
                    <UserPlus size={18} /> {Language === "AM" ? "ባለሙያ መድብ" : "Assign Officer"}
                  </button>
                )}
                <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all ${DarkMode ? 'bg-slate-900/50' : 'bg-white'} ${activeConfig.color} ${activeConfig.border}`}>
                  <span className="animate-pulse">{activeConfig.icon}</span> {activeConfig.label}
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                
                {/* Citizen Info Card */}
                <InfoCard title={Language === "AM" ? "የዜጋው መረጃ" : "Citizen Information"}>
                  {(complaint.isElderly || complaint.isDisabled) && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {complaint.isElderly && <span className="px-4 py-1.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /> Elderly Citizen</span>}
                      {complaint.isDisabled && <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} /> Disabled Citizen</span>}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-3xl bg-textColor text-white flex items-center justify-center font-black text-2xl uppercase shadow-xl shadow-textColor/20">
                        {(complaint.citizen_name || "?")[0]}
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-xl uppercase tracking-tight">{complaint.citizen_name || "Unknown Citizen"}</p>
                        <div className="flex flex-col gap-1.5 text-slate-500 text-sm font-bold">
                          <span className="flex items-center gap-2"><Phone size={14} className="text-textColor" /> {complaint.phone_number || "N/A"}</span>
                          <span className="flex items-center gap-2"><Mail size={14} className="text-textColor" /> {complaint.email || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`grid grid-cols-2 gap-6 border-l pl-8 ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-City / Woreda</p>
                        <p className="text-base font-bold">{complaint.sub_city || "-"}, W-{complaint.woreda || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">House Number</p>
                        <p className="text-base font-bold">{complaint.house_number || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </InfoCard>

                {/* Description Card */}
                <InfoCard title={Language === "AM" ? "የአቤቱታው ዝርዝር" : "Detailed Description"}>
                  <div className={`p-8 border rounded-3xl italic leading-relaxed font-medium text-lg relative ${DarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                    <span className="absolute top-4 left-4 text-4xl opacity-10 font-serif">"</span>
                    {complaint.description || "No description provided."}
                    <span className="absolute bottom-2 right-6 text-4xl opacity-10 font-serif">"</span>
                  </div>
                </InfoCard>

                {/* Notes Section */}
                <InfoCard title="Internal Collaboration Notes">
                  <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {internalNotes?.length > 0 ? (
                      internalNotes.map((note) => (
                        <div key={note.id} className="group relative pl-8 border-l-2 border-slate-200 py-1 transition-all hover:border-textColor">
                          <div className="absolute -left-[10px] top-1 w-5 h-5 rounded-full bg-white border-2 border-textColor shadow-sm transition-transform group-hover:scale-125" />
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[12px] font-black uppercase tracking-tight">{note.user_name || note.User?.username}</span>
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase border border-slate-200 dark:border-slate-700">{note.User?.role || "Staff"}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatEthiopianDate(note.createdAt)}</span>
                          </div>
                          <div className={`p-5 rounded-3xl rounded-tl-none border shadow-sm transition-all ${DarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                            <p className="text-sm font-medium leading-relaxed">{note.note}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 opacity-30">
                        <MessageSquare size={48} className="mx-auto mb-4" />
                        <p className="text-[12px] font-black uppercase tracking-widest">No internal discussions recorded</p>
                      </div>
                    )}
                  </div>

                  {canAddInternalNote && (
                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="relative">
                        <textarea
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                          className={`w-full p-6 pb-20 rounded-[2rem] text-sm font-medium border min-h-[160px] outline-none transition-all resize-none shadow-inner ${DarkMode ? 'bg-slate-900 border-slate-800 focus:border-textColor' : 'bg-slate-50 border-slate-200 focus:border-textColor focus:bg-white'}`}
                          placeholder={Language === "AM" ? "የውስጥ ማስታወሻ እዚህ ይጻፉ..." : "Type an internal update compilen..."}
                        />
                        <div className="absolute bottom-5 right-5 flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase italic"></span>
                          <button
                            onClick={handleAddInternalNote}
                            disabled={isCreatingNote || !internalNote.trim()}
                            className="bg-textColor text-white p-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-textColor/30 disabled:opacity-50"
                          >
                            {isCreatingNote ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </InfoCard>
              </div>

              {/* Right Sidebar Section */}
              <div className="space-y-10">
                
                {/* Meeting Management Component */}
                {complaint.requestsMeeting && (
                
                    <MeetingComponent
                      complaint={complaint}
                      commitText={commitText}
                      setCommitText={setCommitText}
                      selectedExecutive={selectedExecutive}
                      setSelectedExecutive={setSelectedExecutive}
                      activeManager={activeManager}
                      handleApproveMeeting={handleApproveMeeting}
                      handleRejectMeeting={handleRejectMeeting}
                      userRole={userRole}
                      scheduledDate={scheduledDate}
                      setScheduledDate={setScheduledDate}
                      scheduledTime={scheduledTime}
                      setScheduledTime={setScheduledTime}
                      durationMinutes={durationMinutes}
                      setDurationMinutes={setDurationMinutes}
                      outcome={outcome}
                      setOutcome={setOutcome}
                      outcomeNotes={outcomeNotes}
                      setOutcomeNotes={setOutcomeNotes}
                      handleCompleteMeeting={handleCompleteMeeting}
                      handleCancelMeeting={handleCancelMeeting}
                      location={location}
                      setLocation={setLocation}
                      handleScheduleMeeting={handleScheduleMeeting}
                      DarkMode={DarkMode}
                    />
                 
                )}

                {/* Timeline Card */}
                <InfoCard title="Progress Timeline">
                  {isHistoryLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-textColor" /></div>
                  ) : (
                    <div className="space-y-6">
                      {historyLogs && historyLogs.length > 0 ? (
                        historyLogs.map((log) => (
                          <div key={log.id} className="relative pl-7 border-l-2 border-textColor/30 pb-6 last:pb-0">
                            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-textColor shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" />
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-textColor uppercase leading-none">{log.old_status} <span className="text-slate-400 mx-1">→</span> {log.new_status}</span>
                                <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">{formatEthiopianDate(log.createdAt)}</span>
                              </div>
                              <p className="text-[11px] font-medium leading-tight opacity-80">{log.comment}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-5 h-5 rounded-lg bg-textColor/10 flex items-center justify-center text-[9px] font-bold text-textColor border border-textColor/20">{log.User?.username?.[0].toUpperCase() || "U"}</div>
                                <span className="text-[10px] font-black uppercase tracking-tight opacity-60">{log.changed_by_name || log.User?.username}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 opacity-30">
                          <History size={32} className="mx-auto mb-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No activity history</p>
                        </div>
                      )}
                    </div>
                  )}
                </InfoCard>

                {/* Status Update Card */}
                <InfoCard title={canUpdateStatus ? "Administrative Actions" : "Access Restrictions"}>
                  {canUpdateStatus ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Change Status To:</label>
                        <select 
                          value={selectedStatus} 
                          onChange={(e) => setSelectedStatus(e.target.value)} 
                          className={`w-full border-2 p-4 rounded-2xl text-sm font-black outline-none transition-all cursor-pointer appearance-none ${DarkMode ? 'bg-slate-900 border-slate-800 focus:border-textColor' : 'bg-slate-50 border-slate-100 focus:border-textColor'}`}
                        >
                          {filteredStatusKeys.map(k => <option key={k} value={k}>{statusConfig[k].label} {k === complaint?.status ? "(CURRENT)" : ""}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Decision / Remark:</label>
                        <textarea 
                          value={statusComment} 
                          onChange={(e) => setStatusComment(e.target.value)} 
                          className={`w-full p-4 rounded-2xl text-sm font-medium border-2 min-h-[140px] outline-none transition-all ${DarkMode ? 'bg-slate-900 border-slate-800 focus:border-textColor' : 'bg-slate-50 border-slate-100 focus:border-textColor'}`} 
                          placeholder="Why is this status being updated?" 
                        />
                      </div>
                      <button 
                        onClick={handleStatusUpdate} 
                        disabled={isUpdating || (selectedStatus === complaint?.status && !statusComment.trim())} 
                        className="w-full bg-textColor text-white font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] shadow-xl shadow-textColor/30 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                        Update Case Status
                      </button>
                    </div>
                  ) : (
                    <div className={`text-center p-10 rounded-3xl border-2 border-dashed ${DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Lock size={28} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{userRole === "MANAGER" ? "Read-only access to status" : "Unauthorized to modify"}</p>
                    </div>
                  )}
                </InfoCard>

                {/* Attachments Card */}
                <InfoCard title="Evidence & Attachments">
                  <div className="space-y-4">
                    {complaint.Attachments?.length > 0 ? (
                      complaint.Attachments.map((file, index) => {
                        const fileDisplay = getFileDisplay(file.file_type);
                        return (
                          <div key={file.id} className={`group flex items-center justify-between p-4 border rounded-2xl transition-all hover:border-textColor ${DarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center gap-4 overflow-hidden">
                              <div className={`p-3 rounded-xl ${DarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>{fileDisplay.icon}</div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-[11px] font-black truncate uppercase">{file.original_name || "Evidence_File"}</span>
                                <span className="text-[9px] text-textColor font-bold uppercase tracking-tight">{fileDisplay.label}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => { setActiveIndex(index); setOpenFileModal(true); }} 
                              className={`p-2.5 rounded-xl transition-colors ${DarkMode ? 'hover:bg-slate-800 text-slate-500 hover:text-white' : 'hover:bg-slate-50 text-slate-400 hover:text-textColor'}`}
                            >
                              <ExternalLink size={18} />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 opacity-20">
                        <FileCode size={40} className="mx-auto mb-3" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No evidence files provided</p>
                      </div>
                    )}
                  </div>
                </InfoCard>

              </div>
            </div>
          </div>
        </main>
      </div>

      <AttachmentModal 
        open={openFileModal} 
        files={complaint.Attachments || []} 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex} 
        onClose={() => setOpenFileModal(false)} 
      />
    </div>
  );
};

export default ComplaintDetails;