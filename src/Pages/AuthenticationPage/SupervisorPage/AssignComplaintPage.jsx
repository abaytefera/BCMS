import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, ShieldCheck, Calendar, UserPlus, Zap } from "lucide-react";

import Sidebar from "../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar";
import AuthHeader from "../../../Component/AuthenticateComponent/AuthHeader";
import AssignSelector from "../../../Component/AuthenticateComponent/SupervisorComponent/AssignSelectorComponent/AssignSelector";
import PriorityToggle from "../../../Component/AuthenticateComponent/SupervisorComponent/AssignSelectorComponent/PriorityToggle";
import { APi } from "../../../Redux/CenteralAPI";
import { useGetProfileQuery } from "../../../Redux/profileApi";
import { useGetUsersQuery } from "../../../Redux/userApi";
import { logout } from "../../../Redux/auth";

import EthioDatePicker from "./EthioDatePicker";

const API_URL = import.meta.env.VITE_API_URL;

const AssignComplaintPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Accessing DarkMode and Language from Redux
  const { Language, DarkMode } = useSelector((state) => state.webState || {});

  const { data: profile, isLoading: loadingProfile } = useGetProfileQuery();
  const { data: allUsers, isLoading: loadingUsers } = useGetUsersQuery();

  const [officerId, setOfficerId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(new Date());    
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (profile?.status === 401 || allUsers?.status === 401) {
      localStorage.removeItem("authToken");
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [profile, allUsers, dispatch, navigate]);

  const filteredOfficers = useMemo(() => {
    if (!allUsers || !profile) return [];
    return allUsers
      .filter((u) => u.role === "officer" && u.departmentId === profile.departmentId)
      .map((u) => ({
        label: (u.full_name || u.username).toLowerCase(),
        value: u.id,
      }));
  }, [allUsers, profile]);

  const ethioDateToISO = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return null;
    return dateObj.toISOString(); 
  };

  const handleDeploy = async () => {
    if (!officerId || !endDate) {
      toast.error(Language === "AMH" ? "እባክዎ ባለሙያ እና ቀን ይምረጡ" : "Officer and end date required");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsDeploying(true);
    const toastId = toast.loading("Processing...");

    try {
      const response = await fetch(`${API_URL}/api/workflow/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintId: Number(id),
          officerId: Number(officerId),
          priority,
          timeline: {
            start: ethioDateToISO(startDate),
            end: ethioDateToISO(endDate),
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      toast.success("Assigned successfully", { id: toastId });
      dispatch(APi.util.invalidateTags([{ type: 'Complaints', id },{ type: 'ComplaintHistory', id }]));
      setTimeout(() => navigate(`/DetailList/${id}`), 10);
      
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsDeploying(false);
    }
  };

  const loading = loadingProfile || loadingUsers;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      <Toaster position="top-right" />
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col">
        <AuthHeader True />

        <main className={`flex-1 pt-32 px-6 flex justify-center transition-colors ${DarkMode ? 'bg-slate-900/20' : 'bg-slate-50/30'}`}>
          
          <div className={`w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border transition-all h-fit animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            DarkMode 
            ? 'bg-slate-900/60 border-slate-800 shadow-slate-950/50' 
            : 'bg-white border-slate-100 shadow-slate-200/50'
          }`}>
            
            {/* Header Section */}
            <div className="flex flex-col gap-1 mb-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(-1)} 
                  className={`p-2.5 rounded-2xl transition-all active:scale-90 ${
                    DarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <h1 className="text-3xl font-bold tracking-tight capitalize">
                  {Language === "AMH" ? "የምደባ ዝግጅት" : "Assignment setup"}
                </h1>
              </div>
              <div className={`flex items-center gap-2 ml-14 px-3 py-1 rounded-full w-fit text-[11px] font-bold tracking-tight ${
                DarkMode ? 'bg-primBtn ' : 'bg-primBtn text-white '
              }`}>
                <ShieldCheck size={12} />
                <span className="capitalize">Complaint ID: #{id}</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Officer Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <UserPlus size={14} className="text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-400 capitalize">Choose professional</span>
                </div>
                <AssignSelector
                  label="Assign officer"
                  value={officerId}
                  options={filteredOfficers}
                  onChange={setOfficerId}
                  disabled={loading}
                />
              </div>

              {/* Priority Toggle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <Zap size={14} className="text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-400 capitalize">Set priority level</span>
                </div>
                <PriorityToggle selected={priority} onSelect={setPriority} />
              </div>

              {/* Timeline Section */}
              <div className={`grid md:grid-cols-2 gap-6 p-6 rounded-3xl border transition-colors ${
                DarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-slate-400">
                     <Calendar size={14} />
                     <span className="text-[11px] font-bold capitalize">Timeline</span>
                   </div>
                   <EthioDatePicker label="Start date" value={startDate} onChange={setStartDate} />
                </div>
                <div className="flex items-end">
                   <EthioDatePicker label="End date" value={endDate} onChange={setEndDate} />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleDeploy}
                disabled={isDeploying || loading}
                className={`w-full py-5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-indigo-500/10 capitalize flex items-center justify-center gap-3 ${
                  DarkMode 
                  ? 'bg-primBtn text-white shadow-bg-primBtn/20' 
                  : 'bg-primBtn hover:bg-primBtn text-white shadow-slate-200'
                }`}
              >
                {isDeploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Confirm assignment"
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignComplaintPage;