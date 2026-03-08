import React, { useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  Heart,
  Loader2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MapPin, // New Icon
  Layers3  // New Icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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

  /* --- Data Prep for Radial Chart (Categories) --- */
  // RadialBarChart requires an 'fill' property on each data object for distinct colors
  const RADIAL_COLORS = ['#818cf8', '#a78bfa', '#e879f9', '#fb7185', '#fb923c'];
  const formattedRadialData = managementState?.topCategories?.map((item, index) => ({
    ...item,
    fill: RADIAL_COLORS[index % RADIAL_COLORS.length]
  })) || [];

  /* ================= DASHBOARD CARDS ================= */
  const cards = [
    { title: "Total Complaints", value: totalComplaints, icon: Activity, gradient: "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500", onClick: () => navigate("/Complaintlist/admin/list/") },
    { title: "Scheduled Today", value: managementState?.scheduledToday ?? 0, icon: Calendar, gradient: "bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500", onClick: () => navigate("/secretary/list/timeframe/today") },
    { title: "Scheduled This Week", value: managementState?.scheduledThisWeek ?? 0, icon: Calendar, gradient: "bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500", onClick: () => navigate("/secretary/list/timeframe/week") },
    { title: "Completed This Month", value: managementState?.completedThisMonth ?? 0, icon: CheckCircle, gradient: "bg-gradient-to-br from-green-400 via-green-500 to-emerald-500", onClick: () => navigate("/secretary/list/stat/completed") },
    { title: "Escalated Complaints", value: managementState?.escalatedComplaints ?? 0, icon: AlertTriangle, gradient: "bg-gradient-to-br from-red-400 via-red-500 to-rose-500", onClick: () => navigate("/secretary/list/stat/completed") },
    { title: "SLA Compliance", value: slaCompliance, icon: ShieldCheck, gradient: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500" },
    { title: "User Satisfaction", value: `${userSatisfaction}/5`, icon: Heart, gradient: "bg-gradient-to-br from-rose-400 via-rose-500 to-pink-500" }
  ];

  const resolutionData = [
    { name: "Resolved", value: resolvedComplaints, colorStart: "#34d399", colorEnd: "#10b981" },
    { name: "Unresolved", value: unresolvedComplaints, colorStart: "#f87171", colorEnd: "#ef4444" },
    { name: "Pending", value: managementState?.pendingRequests ?? 0, colorStart: "#facc15", colorEnd: "#f59e0b" }
  ];

  /* ================= CUSTOM TOOLTIP ================= */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-xl border border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{payload[0].name}</p>
          <p className="text-2xl font-black">{payload[0].value}</p>
          <p className="text-[10px] text-slate-500">Complaints Registered</p>
        </div>
      );
    }
    return null;
  };

  /* ================= LOADING ================= */
  if (complaintsLoading || stateLoading || chartsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        <main className="flex-1 pb-40 pt-32 px-6 lg:px-10 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, i) => (
                <StatCard key={i} {...card} wave={i % 2 === 0 ? "up" : "down"} delay={i * 0.2} />
              ))}
            </div>

            {/* TREND + PIE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-2">Complaint Trends</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-6">Avg Resolution Time: {managementState?.averageResolutionTime} Days</p>
                <TrendChart data={charts?.trends} />
              </div>
              <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6">Resolution Status</h3>
                <div className="h-[300px]">
                  <ResolutionPie data={resolutionData} />
                </div>
              </div>
            </div>

            {/* NEW VISUALIZATIONS: RADIAL & GRADIENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* BEAUTIFUL GRAPH 1: RADIAL BAR (CATEGORIES) */}
              <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Layers3 size={20} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest">Category Distribution</h3>
                </div>
                <div className="h-[350px] w-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="20%" 
                      outerRadius="100%" 
                      barSize={15} 
                      data={formattedRadialData}
                      startAngle={180} // Starts from bottom left
                      endAngle={-180}   // Creates full circular flow
                    >
                      <RadialBar
                        minAngle={15}
                        background={{ fill: '#f1f5f9' }} // Light gray background track
                        clockWise
                        dataKey="count"
                        cornerRadius={10} // Rounded edges on bars
                      />
                      <Legend 
                        iconSize={10} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingLeft: '10px' }}
                        formatter={(value, entry)=> entry.payload.category} // Use category name in legend
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }}/>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BEAUTIFUL GRAPH 2: SMOOTH GRADIENT AREA (SUB-CITIES) */}
              <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest">Sub-City Volume Flow</h3>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={managementState?.subCityBreakdown} 
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      {/* Define the gradient definition here */}
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/> {/* Rich Sky Blue */}
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>  {/* Fades to transparent */}
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="sub_city" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} 
                      />
                      <YAxis hide /> {/* Hiding Y axis is a common UX pattern for "beauty" graphs */}
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" // This makes the lines SMOOTH, not jagged
                        dataKey="count" 
                        name="Count"
                        stroke="#0ea5e9" // The solid line color
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorCount)" // Applies the gradient definition defined above
                        activeDot={{ r: 6, stroke: 'white', strokeWidth: 3, fill: '#0ea5e9' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* OPERATIONAL INFO */}
            <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">Operational Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div><p className="text-gray-400">Pending Requests</p><p className="font-bold text-lg">{managementState?.pendingRequests}</p></div>
                <div><p className="text-gray-400">Escalated Complaints</p><p className="font-bold text-lg">{managementState?.escalatedComplaints}</p></div>
                <div><p className="text-gray-400">Top Category</p><p className="font-bold text-lg">{topCategory}</p></div>
                <div><p className="text-gray-400">Top Sub City</p><p className="font-bold text-lg">{topSubCity}</p></div>
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