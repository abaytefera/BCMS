import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Activity, ShieldCheck, Heart, Loader2, Calendar,
  AlertTriangle, CheckCircle, MapPin, Layers3, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  RadialBarChart, RadialBar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

import { logout } from "../../../Redux/auth";
import {
  useGetDashboardChartsQuery,
  useGetManagementNewStateQuery
} from "../../../Redux/managementApi";
import { useGetComplaintsDashboardQuery } from "../../../Redux/complaintApi";

import Sidebar from "../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar";
import AuthHeader from "../../../Component/AuthenticateComponent/AuthHeader";
import TrendChart from "../../../Component/AuthenticateComponent/ManagementDashboardComponent/TrendChart";
import ResolutionPie from "../../../Component/AuthenticateComponent/ManagementDashboardComponent/ResolutionPie";
import DepartmentCircularChart from "../../../Component/AuthenticateComponent/AdminDashboardComponent/DepartmentCatagory";
import StatCard from "./StatCard";

const ManagementDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { DarkMode } = useSelector((state) => state.webState);

  /* ================= API CALLS ================= */
  const { data: complaints, isLoading: complaintsLoading, error: complaintsError } = useGetComplaintsDashboardQuery("management");
  const { data: managementState, isLoading: stateLoading, error: stateError } = useGetManagementNewStateQuery();
  const { data: charts, isLoading: chartsLoading, error: chartsError } = useGetDashboardChartsQuery();

  /* ================= AUTH ERROR HANDLING ================= */
  useEffect(() => {
    const errors = [complaintsError, stateError, chartsError];
    const isUnauthorized = errors.some(err => err?.status === 401);
    if (isUnauthorized) {
      localStorage.removeItem("authToken");
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [complaintsError, stateError, chartsError, navigate, dispatch]);

  useEffect(() => window.scrollTo(0, 0), []);

  /* ================= DATA PREP ================= */
  const totalComplaints = complaints?.summary?.total ?? 0;
  const resolvedComplaints = complaints?.summary?.resolved ?? 0;
  const unresolvedComplaints = complaints?.summary?.unresolved ?? 0;
  const slaCompliance = `${complaints?.percentage ?? 0}%`;
  const userSatisfaction = complaints?.satisfaction?.averageSatisfaction ?? "0";

  const topCategory = managementState?.topCategories?.[0]?.category ?? "n/a";
  const topSubCity = managementState?.subCityBreakdown?.[0]?.sub_city ?? "n/a";

  const RADIAL_COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f59e0b'];
  const formattedRadialData = managementState?.topCategories?.map((item, index) => ({
    ...item,
    fill: RADIAL_COLORS[index % RADIAL_COLORS.length]
  })) || [];

  const cards = [
    { title: "total complaints", value: totalComplaints, icon: Activity, gradient: "bg-gradient-to-br from-blue-500 to-indigo-600", onClick: () => navigate("/Complaintlist/admin/list/") },
    { title: "scheduled today", value: managementState?.scheduledToday ?? 0, icon: Calendar, gradient: "bg-gradient-to-br from-violet-500 to-purple-600", onClick: () => navigate("/secretary/list/timeframe/today") },
    { title: "scheduled this week", value: managementState?.scheduledThisWeek ?? 0, icon: Calendar, gradient: "bg-gradient-to-br from-sky-500 to-blue-600", onClick: () => navigate("/secretary/list/timeframe/week") },
    { title: "sla compliance", value: slaCompliance, icon: ShieldCheck, gradient: "bg-gradient-to-br from-emerald-500 to-teal-600" },
  ];

  const resolutionData = [
    { name: "resolved", value: resolvedComplaints, colorStart: "#10b981", colorEnd: "#059669" },
    { name: "unresolved", value: unresolvedComplaints, colorStart: "#f43f5e", colorEnd: "#e11d48" },
    { name: "pending", value: managementState?.pendingRequests ?? 0, colorStart: "#f59e0b", colorEnd: "#d97706" }
  ];

  /* ================= CUSTOM TOOLTIP ================= */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          DarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-100"
        }`}>
          <p className="text-[10px] font-black capitalize tracking-widest text-slate-500 mb-1">{payload[0].name}</p>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-black ${DarkMode ? "text-white" : "text-slate-900"}`}>{payload[0].value}</p>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 capitalize mt-1">complaints registered</p>
        </div>
      );
    }
    return null;
  };

  if (complaintsLoading || stateLoading || chartsLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${DarkMode ? "bg-slate-950" : "bg-white"}`}>
        <Loader2 className="animate-spin text-primBtn" size={48} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${DarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className={`flex-1 pb-40 pt-32 px-6 lg:px-10 overflow-y-auto ${DarkMode ? "bg-slate-950" : "bg-slate-50/50"}`}>
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black capitalize tracking-tight">executive dashboard</h1>
                <p className={`text-sm mt-1 font-medium ${DarkMode ? "text-slate-500" : "text-slate-400"}`}>real-time operational intelligence and analytics</p>
              </div>
              <div className={`px-4 py-2 rounded-2xl border text-xs font-black capitalize tracking-tight ${DarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
                last updated: {new Date().toLocaleTimeString().toLowerCase()}
              </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, i) => (
                <StatCard key={i} {...card} wave={i % 2 === 0 ? "up" : "down"} delay={i * 0.1} />
              ))}
            </div>

            {/* TREND + PIE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`lg:col-span-2 p-8 rounded-[3rem] border-2 transition-all ${
                DarkMode ? "bg-slate-900/40 border-slate-800 shadow-2xl" : "bg-white border-slate-100 shadow-sm"
              }`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-sm font-black capitalize tracking-tight">complaint trends</h3>
                    <p className="text-[11px] text-slate-500 font-bold capitalize">average resolution: {managementState?.averageResolutionTime} days</p>
                  </div>
                  <div className={`p-2 rounded-xl ${DarkMode ? "bg-slate-800 text-primBtn" : "bg-slate-50 text-primBtn"}`}>
                    <Activity size={20} />
                  </div>
                </div>
                <div className="h-[350px]">
                  <TrendChart data={charts?.trends} isDarkMode={DarkMode} />
                </div>
              </div>

              <div className={`p-8 rounded-[3rem] border-2 transition-all ${
                DarkMode ? "bg-slate-900/40 border-slate-800 shadow-2xl" : "bg-white border-slate-100 shadow-sm"
              }`}>
                <h3 className="text-sm font-black capitalize tracking-tight mb-8">resolution status</h3>
                <div className="h-[350px]">
                  <ResolutionPie data={resolutionData} />
                </div>
              </div>
            </div>

            {/* RADIAL & GRADIENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* RADIAL BAR (CATEGORIES) */}
              <div className={`p-8 rounded-[3rem] border-2 transition-all ${
                DarkMode ? "bg-slate-900/40 border-slate-800 shadow-2xl" : "bg-white border-slate-100 shadow-sm"
              }`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${DarkMode ? "bg-primBtn/10 text-primBtn" : "bg-indigo-50 text-indigo-600"}`}>
                    <Layers3 size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-black capitalize tracking-tight">category distribution</h3>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={12} data={formattedRadialData} startAngle={180} endAngle={-180}>
                      <RadialBar minAngle={15} background={{ fill: DarkMode ? '#1e293b' : '#f1f5f9' }} clockWise dataKey="count" cornerRadius={10} />
                      <Legend iconSize={8} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'capitalize', paddingTop: '20px' }} formatter={(value, entry)=> entry.payload.category.toLowerCase()} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }}/>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SMOOTH GRADIENT AREA (SUB-CITIES) */}
              <div className={`p-8 rounded-[3rem] border-2 transition-all ${
                DarkMode ? "bg-slate-900/40 border-slate-800 shadow-2xl" : "bg-white border-slate-100 shadow-sm"
              }`}>
                 <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${DarkMode ? "bg-primBtn/10 text-primBtn" : "bg-sky-50 text-sky-600"}`}>
                    <MapPin size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-black capitalize tracking-tight">sub-city volume flow</h3>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={managementState?.subCityBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={DarkMode ? "#1e293b" : "#f1f5f9"} />
                      <XAxis dataKey="sub_city" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b', textTransform: 'capitalize' }} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 8, stroke: DarkMode ? '#0f172a' : 'white', strokeWidth: 4, fill: '#6366f1' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* OPERATIONAL INFO */}
            <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${
              DarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <h3 className="text-sm font-black capitalize tracking-tight mb-8">operational overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                 
                  { label: "escalated items", val: managementState?.escalatedComplaints, color: "text-rose-500" },
                  { label: "primary category", val: topCategory, color: "text-primBtn" },
                  { label: "active sub-city", val: topSubCity, color: "text-primBtn" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 capitalize tracking-widest">{item.label}</p>
                    <p className={`text-xl font-black capitalize tracking-tight ${item.color}`}>{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <DepartmentCircularChart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagementDashboard;