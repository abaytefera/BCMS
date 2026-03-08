import React, { useEffect } from "react";
import { 
  CalendarCheck, CheckCircle, Loader2, 
  Activity, TrendingUp, Inbox
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
import { useDispatch } from "react-redux";

const SecretaryDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: secData, isLoading: secLoading, error: secError } = useGetSecretaryDashboardQuery();

  useEffect(() => {
    if (secError?.status === 401) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [secError, dispatch, navigate]);

  if (secLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Preparing Analytics...</p>
      </div>
    );
  }

  const secStats = secData?.data || secData;
  
  const scheduledCount = secStats?.byStatus?.find((s) => s.status === "SCHEDULED")?.count || 0;
  const approvedCount = secStats?.byStatus?.find((s) => s.status === "APPROVED")?.count || 0;

  // Area chart looks best with a few points, so we map the status flow
  const chartData = [
    { name: 'Initial', count: 0 },
    { name: 'Scheduled', count: scheduledCount },
    { name: 'Approved', count: approvedCount },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="secretary" />

      <div className="flex-1 flex flex-col">
        <AuthHeader True={true} />

        <main className="pt-28 px-6 lg:px-10 pb-12">
          <div className="max-w-7xl mx-auto space-y-10">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {secStats?.executiveContext || "Executive"} Analytics
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Performance and meeting flow overview</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-600 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Dashboard
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <StatCard 
                title="Scheduled" 
                value={scheduledCount} 
                icon={CalendarCheck} 
                gradient="bg-indigo-600" 
                onClick={() => navigate("/secretary/list/status/SCHEDULED")}
              />
              <StatCard 
                title="Approved" 
                value={approvedCount} 
                icon={CheckCircle} 
                gradient="bg-emerald-500" 
                onClick={() => navigate("/secretary/list/status/APPROVED")}
              />
            </div>

            {/* BEAUTIFUL AREA GRAPH SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 px-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Workflow Analysis</h3>
                    <p className="text-sm text-slate-400">Meeting progression trends</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-2xl">
                    <TrendingUp className="text-indigo-600" size={24} />
                  </div>
                </div>

                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                          padding: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#6366f1" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Metric Insight */}
              <div className="bg-primBtn rounded-[2.5rem] p-10 shadow-xl flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Inbox size={120} />
                </div>
                
                <div className="relative z-10">
                  <Activity className="text-indigo-400 mb-6" size={32} />
                  <h3 className="text-lg font-bold opacity-80 uppercase tracking-widest mb-1">Total Compilen</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black">{Number(scheduledCount) + Number(approvedCount)}</span>
                    <span className="text-white font-bold">Compilen</span>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-slate-800">
                   <p className="text-white text-sm leading-relaxed">
                     Your workspace currently has <span className="text-white font-bold">{approvedCount}</span> verified meetings. Keep up the great work!
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