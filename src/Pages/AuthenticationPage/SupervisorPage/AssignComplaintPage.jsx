import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import Sidebar from "../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar";
import AuthHeader from "../../../Component/AuthenticateComponent/AuthHeader";
import AssignSelector from "../../../Component/AuthenticateComponent/SupervisorComponent/AssignSelectorComponent/AssignSelector";
import PriorityToggle from "../../../Component/AuthenticateComponent/SupervisorComponent/AssignSelectorComponent/PriorityToggle";
import { APi } from "../../../Redux/CenteralAPI";
import { useGetProfileQuery } from "../../../Redux/profileApi";
import { useGetUsersQuery } from "../../../Redux/userApi";
import { logout } from "../../../Redux/auth";

import EthioDatePicker from "./EthioDatePicker";
import { ApiProvider } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const AssignComplaintPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Language } = useSelector((state) => state.webState || {});

  const { data: profile, isLoading: loadingProfile } = useGetProfileQuery();
  const { data: allUsers, isLoading: loadingUsers } = useGetUsersQuery();

  const [officerId, setOfficerId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(new Date());    
  const [isDeploying, setIsDeploying] = useState(false);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (profile?.status === 401 || allUsers?.status === 401) {
      localStorage.removeItem("authToken");
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [profile, allUsers, dispatch, navigate]);

  /* ---------------- FILTER OFFICERS ---------------- */
  const filteredOfficers = useMemo(() => {
    if (!allUsers || !profile) return [];
    return allUsers
      .filter((u) => u.role === "officer" && u.departmentId === profile.departmentId)
      .map((u) => ({
        label: u.full_name || u.username,
        value: u.id,
      }));
  }, [allUsers, profile]);

  const ethioDateToISO = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return null;
    return dateObj.toISOString(); 
  };

  /* ---------------- SUBMIT ---------------- */
  const handleDeploy = async () => {
    if (!officerId || !endDate) {
      toast.error(Language === "AMH" ? "እባክዎ ባለሙያ እና ቀን ይምረጡ" : "Officer and End Date required");
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

      toast.success("Assigned Successfully", { id: toastId });
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
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-right" />
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col">
        <AuthHeader True />

        <main className="flex-1 pt-32 px-6 flex justify-center bg-slate-50/30">
        
          <div className="w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
            {/* BACK ICON ADDED HERE */}
            <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <h1 className="text-3xl font-black">
                {Language === "AMH" ? "የምደባ ዝግጅት" : "Assignment Setup"}
              </h1>
            </div>

            <p className="text-textColor font-bold mb-10 text-sm tracking-widest ml-12">COMPLAINT ID: #{id}</p>

            <div className="space-y-8">
              <AssignSelector
                label="Assign Officer"
                value={officerId}
                options={filteredOfficers}
                onChange={setOfficerId}
                disabled={loading}
              />

              <PriorityToggle selected={priority} onSelect={setPriority} />

              <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl">
                <EthioDatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                <EthioDatePicker label="End Date" value={endDate} onChange={setEndDate} />
              </div>

              <button
                onClick={handleDeploy}
                disabled={isDeploying || loading}
                className="w-full bg-textColor  text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all disabled:bg-slate-300 shadow-lg shadow-emerald-100"
              >
                {isDeploying ? "Processing..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignComplaintPage;