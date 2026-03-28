import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, UserPlus, CheckCircle2, Users, XCircle, Loader2, 
  AlertCircle, LayoutDashboard, ArrowUpRight
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';

// API
import { useGetSupervisorStatsQuery } from '../../../Redux/supervisorApi';
import { useGetComplaintsDashboardQuery } from '../../../Redux/complaintApi';

// Components
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import TrendChart from '../../../Component/AuthenticateComponent/ManagementDashboardComponent/TrendChart';
import SLAWarning from './SLAWarning';

// Redux
import { logout } from '../../../Redux/auth';

const SupervisorDashboard = () => {
  const { Language, DarkMode } = useSelector((state) => state.webState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const { isLoading: statsLoading, error: statsError } = useGetSupervisorStatsQuery();
  const { data: CompileList, isLoading: listLoading, error: listError } =
    useGetComplaintsDashboardQuery('supervisor');

  useEffect(() => {
    if (statsError?.status === 401 || listError?.status === 401) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [statsError, listError, dispatch, navigate]);

  // Translations with Capitalize standard
  const t = useMemo(() => ({
    live: Language === "AMH" ? "ቀጥታ" : "Live status",
    notAssigned: Language === "AMH" ? "ያልተመደቡ" : "Not assigned",
    resolved: Language === "AMH" ? "የተፈቱ" : "Resolved",
    rejected: Language === "AMH" ? "ውድቅ የተደረጉ" : "Rejected",
    inProgress: Language === "AMH" ? "በሂደት ላይ" : "In progress",
    urgent: Language === "AMH" ? "አስቸኳይ ቅሬታ" : "Urgent complaint",
    distribution: Language === "AMH" ? "የአቤቱታዎች ስርጭት" : "Complaint distribution"
  }), [Language]);

  // Pie Data - SaaS Semantic Colors
  const chartData = useMemo(() => {
    const others = (CompileList?.notAssigned || 0) + (CompileList?.resolved || 0) + (CompileList?.rejected || 0);
    const inProgress = Math.max(0, (CompileList?.totalComplaints || 0) - others);

    return [
      { name: t.notAssigned, value: CompileList?.notAssigned || 0, color: '#6366f1' }, // Indigo
      { name: t.resolved, value: CompileList?.resolved || 0, color: '#10b981' },    // Emerald
      { name: t.rejected, value: CompileList?.rejected || 0, color: '#f43f5e' },    // Rose
      { name: t.inProgress, value: inProgress, color: '#f59e0b' },                 // Amber
    ];
  }, [CompileList, t]);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent === 0) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="#fff" fontSize={10} fontWeight={900} textAnchor="middle" dominantBaseline="central">
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  if (statsLoading || listLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${DarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <Loader2 className="animate-spin text-primBtn" size={48} strokeWidth={2.5} />
      </div>
    );
  }

  const cards = [
    { title: 'Total complaints', count: CompileList?.totalComplaints, icon: BarChart3, type: "list" },
    { title: t.notAssigned, count: CompileList?.notAssigned, icon: UserPlus, type: "unassigned" },
    { title: t.resolved, count: CompileList?.resolved, icon: CheckCircle2, type: "resolved" },
    { title: t.rejected, count: CompileList?.rejected, icon: XCircle, type: "rejected" },
    { title: t.urgent, count: CompileList?.urgentComplaint, icon: AlertCircle, type: 'urgent' },
    { title: 'Active officers', count: CompileList?.activeOfficers, icon: Users, type: "user" },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${DarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50/50 text-slate-900'}`}>
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className="flex-1 pt-32 px-6 lg:px-12 pb-12 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">

            {/* Header Section */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={16} className="text-primBtn" />
                  <span className={`text-[10px] font-black capitalize tracking-[0.2em] ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.live} overview
                  </span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter capitalize">Supervisor dashboard</h1>
              </div>
             
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6 mb-12">
              {cards.map((card, i) => (
                <SLAWarning
                  key={i}
                  title={card.title}
                  count={card.count}
                  icon={card.icon}
                  onClick={() => {
                    if (card.type !== "user") {
                      navigate(`/Complaintlist/${user?.role}/${card.type}`)
                    } else {
                      navigate("/userMg")
                    }
                  }}
                  wave={i % 2 === 0 ? 'up' : 'down'}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Trend Chart */}
              <div className={`xl:col-span-2 rounded-[3rem] p-10 border transition-all duration-500 ${
                DarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/30'
              }`}>
                <div className="mb-8">
                  <h3 className="text-lg font-black capitalize tracking-tight mb-1">Complaint trends</h3>
                  <p className={`text-[10px] font-bold capitalize ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Weekly incoming versus resolution volume
                  </p>
                </div>
                <div className="h-[400px]">
                   <TrendChart />
                </div>
              </div>

              {/* Pie Chart */}
              <div className={`rounded-[3rem] p-10 border transition-all duration-500 ${
                DarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/30'
              }`}>
                <h3 className="text-lg font-black capitalize tracking-tight mb-8">
                  {t.distribution}
                </h3>

                <div className="h-[350px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius="65%"
                        outerRadius="90%"
                        paddingAngle={8}
                        dataKey="value"
                        labelLine={false}
                        label={renderLabel}
                        stroke="none"
                      >
                        {chartData.map((e, i) => (
                          <Cell key={i} fill={e.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: DarkMode ? '#1e293b' : '#fff',
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        iconType="circle" 
                        formatter={(value) => <span className={`text-[10px] font-black capitalize px-2 ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupervisorDashboard;