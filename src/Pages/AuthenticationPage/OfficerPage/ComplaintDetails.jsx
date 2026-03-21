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
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;
const {data:activeManager,isLoading:isLoadingActive,isError:isErrorActive,error:errorActive}=useGetActiveManagerQuery()
  // Permissions
  const canUpdateStatus = ["SUPERVISOR", "OFFICER","MANAGER"].includes(userRole);
  const canAddInternalNote = ["SUPERVISOR", "OFFICER", "MANAGER"].includes(userRole);

  // Local State
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [internalNote, setInternalNote] = useState("");
  
  // Meeting Management State
  const [meetingAction, setMeetingAction] = useState(null); // 'approve' or 'reject'
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [rejectionReason, setRejectionReason] = useState("")
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

  const complaintId = useMemo(() => (!isNaN(Number(id)) ? Number(id) : null), [id]);

  // API Queries


  const { data: complaint, isLoading, isError, refetch: refetchComplaint } = complaintApi.useGetComplaintByIdQuery(complaintId, { skip: !complaintId });
  const { data: historyLogs, isLoading: isHistoryLoading, refetch: refetchHistory } = complaintApi.useGetComplaintHistoryQuery(complaintId, { skip: !complaintId });
  const { data: internalNotes, refetch: refetchInternalNotes } = complaintApi.useGetInternalNotesQuery({ complaintId }, { skip: !complaintId });
const [
  approveMeeting,
  { isLoading: isApproving, isError: isApproveError, error: approveError }
] = complaintApi.useApproveMeetingMutation();


useEffect(()=>{
console.log(complaint)

},[complaint])

const [
  scheduleMeeting,
  { isLoading: isScheduling, isError: isScheduleError, error: scheduleError }
] = complaintApi.useScheduleMeetingMutation();

const [
  completeMeeting,
  { isLoading: isCompleting, isError: isCompleteError, error: completeError }
] = complaintApi.useCompleteMeetingMutation();
const [
  cancelMeeting,
  { isLoading: isCancelling, isError: isCancelError, error: cancelError }
] = complaintApi.useCancelMeetingMutation();

  // API Mutations
  const [updateStatus, { isLoading: isUpdating }] = complaintApi.useUpdateComplaintStatusMutation();
  const [createInternalNote, { isLoading: isCreatingNote }] = complaintApi.useCreateInternalNoteMutation();

  useEffect(() => {
    if (complaint?.status) setSelectedStatus(complaint.status);
  }, [complaint]);
    useEffect(()=>{
      console.log('selam')
  console.log(complaint)
    },[complaint])

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





// Supervisor Approve
const handleApproveMeeting = async () => {
  if (!selectedExecutive) return toast.error("Select manager");

  try {
    toast.loading("Approving meeting...", { id: "approve" });
 console.log({
      compileid: complaint.id,
      manager_id: selectedExecutive,
      commit: commitText || "Meeting approved",
      isapprove: true,
      meeting_id: complaint?.Meeting?.id})
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

    console.log(err)
    toast.error(approveError?.data?.message || "Approval failed", { id: "approve" });
  }
};

// Supervisor Reject
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
    console.log(err)
    toast.error(approveError?.data?.message || "Reject failed", { id: "reject" });
  }
};

// Manager Schedule
const handleScheduleMeeting = async () => {
  if (!scheduledDate || !scheduledTime || !durationMinutes || !location) {
    return toast.error("Fill all fields");
  }

  try {
    toast.loading("Scheduling meeting...", { id: "schedule" });
  console.log({
      meeting_id: complaint?.Meeting?.id,
      scheduledDate,
      scheduledTime,
      durationMinutes,
      location
    })
    await scheduleMeeting({
      meeting_id: complaint?.Meeting?.id,
      scheduledDate,
      scheduledTime,
      endingdate:durationMinutes,
      location
    }).unwrap();

    toast.success("Meeting scheduled", { id: "schedule" });
    refetchComplaint();

  } catch (err) {
    console.log(err)
    toast.error(scheduleError?.data?.message || "Schedule failed", { id: "schedule" });
  }
};

// Complete Meeting
const handleCompleteMeeting = async () => {
  if (!outcome) return toast.error("Select outcome");

  try {
    toast.loading("Completing meeting...", { id: "complete" });
console.log({
      meeting_id: complaint?.Meeting?.id,
      outcome,
      outcomeNotes,
      endMeeting:durationMinutes
    })
    await completeMeeting({
      meeting_id: complaint?.Meeting?.id,
      outcome,
      outcomeNotes,
      endMeeting:durationMinutes
    }).unwrap();

    toast.success("Meeting completed", { id: "complete" });
    refetchComplaint();

  } catch (err) {
    console.log(err)
    toast.error(completeError?.data?.message || "Update failed", { id: "complete" });
  }
};

// Cancel Meeting
const handleCancelMeeting = async () => {
  try {
    toast.loading("Cancelling meeting...", { id: "cancel" });

    await cancelMeeting({ meeting_id: meeting.id }).unwrap();

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
    <div className="flex min-h-screen font-sans text-slate-800 bg-white">
      <Toaster position="top-right" />
      <Sidebar role={userRole?.toLowerCase() || "officer"} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className="flex-grow pt-32 pb-20 px-6 lg:px-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate("/Complaintlist/supervisor/unassigned")} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-black text-textColor tracking-tighter uppercase">{complaint.ref_number || "REF-NULL"}</h1>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border mt-2 inline-block ${complaint.priority === 'HIGH' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                    {complaint.priority || "NORMAL"} PRIORITY
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {userRole === "SUPERVISOR" && (
                  <button onClick={() => navigate(`/AssignComplain/${id}`)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-emerald-100 bg-textColor text-white transition-all shadow-sm">
                    <UserPlus size={16} /> Assign Officer
                  </button>
                )}
                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest border bg-white ${activeConfig.color} ${activeConfig.border}`}>
                  {activeConfig.icon} {activeConfig.label}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <InfoCard title="Citizen Information">
                  {(complaint.isElderly || complaint.isDisabled) && (
                    <div className="flex gap-2 mb-4">
                      {complaint.isElderly && <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> Elderly Citizen</span>}
                      {complaint.isDisabled && <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> Disabled Citizen</span>}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-textColor text-white flex items-center justify-center font-black text-xl uppercase">
                        {(complaint.citizen_name || "?")[0]}
                      </div>
                      <div>
                        <p className="font-black text-textColor uppercase tracking-tight">{complaint.citizen_name || "Unknown Citizen"}</p>
                        <div className="flex flex-col gap-0.5 mt-1 text-slate-500 text-xs font-bold">
                          <span className="flex items-center gap-1.5 text-textColor truncate"><Phone size={12} /> {complaint.phone_number || "N/A"}</span>
                          <span className="flex items-center gap-1.5 truncate"><Mail size={12} /> {complaint.email || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-l border-slate-100 pl-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sub-City / Woreda</p>
                        <p className="text-sm font-bold text-slate-700">{complaint.sub_city || "-"}, {complaint.woreda || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Submitted</p>
                        <p className="text-sm font-bold text-slate-700">{formatEthiopianDate(complaint.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </InfoCard>

                <InfoCard title="Complaint Description">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl italic text-slate-600 leading-relaxed font-medium">
                    "{complaint.description || "No description provided."}"
                  </div>
                </InfoCard>

                <InfoCard title="Internal Collaboration Notes">
                  <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {internalNotes?.length > 0 ? (
                      internalNotes.map((note) => (
                        <div key={note.id} className="relative pl-6 border-l-2 border-slate-100 py-1 hover:border-textColor transition-colors">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-textColor shadow-sm" />
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{note.user_name || note.User?.username}</span>
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[8px] font-black text-slate-500 uppercase border border-slate-200">{note.User?.role || "Staff"}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{formatEthiopianDate(note.createdAt)}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{note.note}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-40">
                        <MessageSquare size={32} className="mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No internal discussions recorded</p>
                      </div>
                    )}
                  </div>

                  {canAddInternalNote && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <div className="relative">
                        <textarea
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                          className="w-full bg-slate-50 p-4 pb-14 rounded-3xl text-sm font-medium border border-slate-200 min-h-[120px] outline-none focus:border-textColor focus:bg-white transition-all resize-none shadow-inner"
                          placeholder="Type an internal update for colleagues..."
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-3">
                          <span className="text-[9px] font-black text-slate-400 uppercase hidden sm:block italic">Visible to staff only</span>
                          <button
                            onClick={handleAddInternalNote}
                            disabled={isCreatingNote || !internalNote.trim()}
                            className="bg-textColor text-white p-3 rounded-2xl transition-all shadow-lg disabled:opacity-50"
                          >
                            {isCreatingNote ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </InfoCard>
              </div>

              <div className="space-y-8">
               {complaint.requestsMeeting && (
  <InfoCard title="Meeting Management">
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
      location={ location}
      setLocation={setLocation}

     handleScheduleMeeting={handleScheduleMeeting}
    />
  </InfoCard>
)}

                <InfoCard title="Progress Timeline">
                  {isHistoryLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>
                  ) : (
                    <div className="space-y-4">
                      {historyLogs && historyLogs.length > 0 ? (
                        historyLogs.map((log) => (
                          <div key={log.id} className="relative pl-6 border-l border-textColor pb-5 last:pb-0">
                            <div className="absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full bg-textColor shadow-[0_0_0_3px_rgba(16,185,129,0.1)]" />
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{log.old_status} <span className="text-slate-400 mx-1">→</span> {log.new_status}</span>
                                <span className="text-[8px] text-slate-400 font-bold whitespace-nowrap">{formatEthiopianDate(log.createdAt)}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 font-medium leading-tight">{log.comment}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">{log.User?.username?.[0].toUpperCase() || "U"}</div>
                                <span className="text-[9px] text-textColor font-black uppercase tracking-tight">{log.changed_by_name || log.User?.username}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 opacity-30">
                          <History size={24} className="mx-auto mb-2" />
                          <p className="text-[9px] font-black uppercase tracking-widest">No activity history</p>
                        </div>
                      )}
                    </div>
                  )}
                </InfoCard>

                <InfoCard title={canUpdateStatus ? "Administrative Actions" : "Access Restrictions"}>
                  {canUpdateStatus ? (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Change Status To:</label>
                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-textColor cursor-pointer appearance-none transition-all">
                          {filteredStatusKeys.map(k => <option key={k} value={k}>{statusConfig[k].label} {k === complaint?.status ? "(CURRENT)" : ""}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Case Remark / Decision:</label>
                        <textarea value={statusComment} onChange={(e) => setStatusComment(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-medium border-2 border-slate-100 min-h-[120px] outline-none focus:border-textColor transition-all" placeholder="Why is this status being updated?" />
                      </div>
                      <button onClick={handleStatusUpdate} disabled={isUpdating || (selectedStatus === complaint?.status && !statusComment.trim())} className="w-full bg-textColor text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed">
                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}Update status
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <Lock size={20} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{userRole === "MANAGER" ? "Read-only access to status" : "Unauthorized to modify"}</p>
                    </div>
                  )}
                </InfoCard>

                <InfoCard title="Attachments">
                  <div className="space-y-3">
                    {complaint.Attachments?.length > 0 ? complaint.Attachments.map((file, index) => {
                      const fileDisplay = getFileDisplay(file.file_type);
                      return (
                        <div key={file.id} className="group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-textColor transition-all">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-slate-50 text-textColor rounded-lg">{fileDisplay.icon}</div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-[10px] font-black text-slate-900 truncate uppercase">{file.original_name || "File"}</span>
                              <span className="text-[8px] text-textColor font-bold uppercase">{fileDisplay.label}</span>
                            </div>
                          </div>
                          <button onClick={() => { setActiveIndex(index); setOpenFileModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><ExternalLink size={14} /></button>
                        </div>
                      );
                    }) : <p className="text-[10px] font-bold text-slate-300 uppercase text-center py-4">No files uploaded</p>}
                  </div>
                </InfoCard>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AttachmentModal open={openFileModal} files={complaint.Attachments || []} activeIndex={activeIndex} setActiveIndex={setActiveIndex} onClose={() => setOpenFileModal(false)} />
    </div>
  );
};

export default ComplaintDetails;