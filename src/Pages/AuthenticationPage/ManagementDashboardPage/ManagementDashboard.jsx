import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ShieldCheck,
  Heart,
  Loader2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Layers3,
  TrendingUp
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
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
  const { DarkMode } = useSelector((state) => state.webState || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const topCategory = managementState?.topCategories?.[0]?.category ?? "N/A";
  const topSubCity = managementState?.subCityBreakdown?.[0]?.sub_city ?? "N/A";

  const RADIAL_COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f59e0b'];
  const formattedRadialData = managementState?.topCategories?.map((item, index) => ({
    ...item,
    fill: RADIAL_COLORS[index % RADIAL_COLORS.length]
  })) || [];

  /* ================= DASHBOARD CARDS ================= */
  const cards = [
    { title: "Total complaints", value: totalComplaints, icon: Activity, gradient: "bg-gradient-to-br from-blue-500 to-indigo-600", onClick: () => navigate("/Complaintlist/admin/list/") },
    { title: "Scheduled today", value: managementState?.scheduledToday ?? 0, icon: Calendar, gradient: "bg-gradient-to-br from-violet-500 to-purple-600", onClick: () => navigate("/secretary/list/timeframe/today") },
    { title: "SLA compliance", value: slaCompliance, icon: ShieldCheck, gradient: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { title: "User satisfaction", value: `${userSatisfaction}/5`, icon: Heart, gradient: "bg-gradient-to-br from-rose-500 to-pink-600" }
  ];

  const resolutionData = [
    { name: "Resolved", value: resolvedComplaints, colorStart: "#10b981", colorEnd: "#059669" },
    { name: "Unresolved", value: unresolvedComplaints, colorStart: "#ef4444", colorEnd: "#dc2626" },
    { name: "Pending", value: managementState?.pendingRequests ?? 0, colorStart: "#f59e0b", colorEnd: "#d97706" }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-2xl shadow-2xl border ${DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <p className={`text-[10px] font-black capitalize tracking-widest mb-1 ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{payload[0].name}</p>
          <p className={`text-2xl font-black ${DarkMode ? 'text-white' : 'text-slate-900'}`}>{payload[0].value}</p>
          <p className="text-[10px] font-bold text-primBtn capitalize">Complaints registered</p>
        </div>
      );
    }
    return null;
  };

  if (complaintsLoading || stateLoading || chartsLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${DarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <Loader2 className="animate-spin text-primBtn" size={48} strokeWidth={2.5} />
      </div>
    );
  }

  // Common Section Styling
  const sectionClass = `border transition-all duration-300 p-8 rounded-[2.5rem] shadow-sm ${
    DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  }`;

  const headerLabel = `text-[11px] font-black capitalize tracking-[0.15em] mb-2 ${
    DarkMode ? 'text-slate-500' : 'text-slate-400'
  }`;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className={`flex-1 pb-40 pt-32 px-6 lg:px-10 overflow-y-auto transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* PAGE TITLE */}
            <div className="flex flex-col gap-1">
              <h1 className={`text-3xl font-black capitalize tracking-tight ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
                Executive <span className="text-primBtn">dashboard</span>
              </h1>
              <p className={`text-sm font-medium ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Real-time management overview and analytics
              </p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, i) => (
                <StatCard key={i} {...card} wave={i % 2 === 0 ? "up" : "down"} delay={i * 0.1} />
              ))}
            </div>

            {/* TREND + PIE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`${sectionClass} lg:col-span-2`}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className={headerLabel}>Complaint trends</h3>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-500" />
                      <p className={`text-sm font-bold ${DarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Avg resolution: {managementState?.averageResolutionTime} days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[320px]">
                  <TrendChart data={charts?.trends} isDark={DarkMode} />
                </div>
              </div>

              <div className={sectionClass}>
                <h3 className={headerLabel}>Resolution status</h3>
                <div className="h-[320px] mt-4">
                  <ResolutionPie data={resolutionData} isDark={DarkMode} />
                </div>
              </div>
            </div>

            {/* RADIAL & GRADIENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={sectionClass}>
                <div className="flex items-center gap-4 mb-10">
                  <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Layers3 size={22} />
                  </div>
                  <h3 className={headerLabel}>Category distribution</h3>
                </div>
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" cy="50%" innerRadius="25%" outerRadius="100%" barSize={14} 
                      data={formattedRadialData} startAngle={180} endAngle={-180}
                    >
                      <RadialBar
                        minAngle={15}
                        background={{ fill: DarkMode ? '#1e293b' : '#f8fafc' }}
                        clockWise dataKey="count" cornerRadius={12}
                      />
                      <Legend 
                        iconSize={8} layout="horizontal" verticalAlign="bottom" 
                        wrapperStyle={{ fontSize: '11px', fontWeight: 800, textTransform: 'capitalize', paddingTop: '20px' }}
                        formatter={(value, entry)=> entry.payload.category}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }}/>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={sectionClass}>
                <div className="flex items-center gap-4 mb-10">
                  <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
                    <MapPin size={22} />
                  </div>
                  <h3 className={headerLabel}>Sub-city volume flow</h3>
                </div>
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={managementState?.subCityBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={DarkMode ? 0.3 : 0.5}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={DarkMode ? "#1e293b" : "#f1f5f9"} />
                      <XAxis 
                        dataKey="sub_city" axisLine={false} tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: DarkMode ? '#64748b' : '#94a3b8', capitalize: true }} 
                      />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={4}
                        fillOpacity={1} fill="url(#colorCount)"
                        activeDot={{ r: 8, stroke: DarkMode ? '#0f172a' : 'white', strokeWidth: 3, fill: '#0ea5e9' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* OPERATIONAL OVERVIEW */}
           

            <div className={sectionClass}>
               <DepartmentCircularChart isDark={DarkMode} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagementDashboard;