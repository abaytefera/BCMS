import React, { useEffect } from "react";
import { 
  CalendarCheck, CheckCircle, Loader2, 
  Activity, TrendingUp, Inbox, Zap
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import Sidebar from "../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar";
import AuthHeader from "../../Component/AuthenticateComponent/AuthHeader";
import StatCard from "../AuthenticationPage/ManagementDashboardPage/StatCard";
import { useGetSecretaryDashboardQuery } from "../../Redux/secreatryApi";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/auth";
import { useDispatch, useSelector } from "react-redux";

const SecretaryDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { DarkMode } = useSelector((state) => state.webState || {});

  const { data: secData, isLoading: secLoading, error: secError } = useGetSecretaryDashboardQuery();

  useEffect(() => {
    if (secError?.status === 401) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [secError, dispatch, navigate]);

  if (secLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${DarkMode ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
        <Loader2 className="animate-spin text-primBtn mb-4" size={48} />
        <p className={`font-bold capitalize ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Preparing analytics...</p>
      </div>
    );
  }

  const secStats = secData?.data || secData;
  const scheduledCount = secStats?.byStatus?.find((s) => s.status === "SCHEDULED")?.count || 0;
  const approvedCount = secStats?.byStatus?.find((s) => s.status === "APPROVED")?.count || 0;

  const chartData = [
    { name: 'Initial', count: 0 },
    { name: 'Scheduled', count: scheduledCount },
    { name: 'Approved', count: approvedCount },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${DarkMode ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
      <Sidebar role="secretary" />

      <div className="flex-1 flex flex-col">
        <AuthHeader True={true} />

        <main className="pt-28 px-6 lg:px-10 pb-12">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className={`text-4xl font-black tracking-tight capitalize ${DarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {(secStats?.executiveContext || "Secretary").toLowerCase()} analytics
                </h1>
                <p className={`mt-2 font-medium ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Performance and meeting flow overview
                </p>
              </div>
              <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                DarkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-300' 
                : 'bg-white border-slate-100 shadow-sm text-slate-600'
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-primBtn animate-pulse" />
               
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <StatCard 
                title="scheduled" 
                value={scheduledCount} 
                icon={CalendarCheck} 
                gradient={DarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"} 
                onClick={() => navigate("/secretary/list/status/SCHEDULED")}
              />
              <StatCard 
                title="approved" 
                value={approvedCount} 
                icon={CheckCircle} 
                gradient="bg-primBtn" 
                onClick={() => navigate("/secretary/list/status/APPROVED")}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className={`lg:col-span-2 rounded-[2.5rem] p-8 border-2 transition-all ${
                DarkMode 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-10 px-2">
                  <div>
                    <h3 className={`text-xl font-black capitalize ${DarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      Workflow analysis
                    </h3>
                    <p className="text-sm text-slate-500 capitalize">Meeting progression trends</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <TrendingUp className="text-primBtn" size={24} />
                  </div>
                </div>

                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={DarkMode ? "#1e293b" : "#f1f5f9"} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: DarkMode ? '#475569' : '#94a3b8', fontSize: 12, fontWeight: 700}} 
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '24px', 
                          backgroundColor: DarkMode ? '#0f172a' : '#ffffff',
                          border: DarkMode ? '2px solid #1e293b' : 'none', 
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                          padding: '16px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#6366f1" 
                        strokeWidth={6}
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Metric Insight */}
              <div className={`rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden transition-all duration-500 ${
                DarkMode ? 'bg-slate-900 border-2 border-primBtn/20' : 'bg-primBtn'
              }`}>
                <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
                   <Inbox size={200} />
                </div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${DarkMode ? 'bg-primBtn' : 'bg-white/20 backdrop-blur-md'}`}>
                    <Zap className="text-white" size={28} fill="white" />
                  </div>
                  <h3 className="text-sm font-bold opacity-70 capitalize tracking-tight mb-2">Total compiled items</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-8xl font-black tabular-nums">
                      {Number(scheduledCount) + Number(approvedCount)}
                    </span>
                    <span className="text-xl font-bold opacity-80 capitalize">Total</span>
                  </div>
                </div>

                <div className={`relative z-10 pt-8 border-t ${DarkMode ? 'border-slate-800' : 'border-white/20'}`}>
                   <p className="text-white/90 text-[15px] leading-relaxed font-medium">
                     Your workspace currently has <span className="font-black underline decoration-white/40">{approvedCount}</span> verified meetings. Keep up the great work!
                   </p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecretaryDashboard;