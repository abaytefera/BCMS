import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, UserPlus, CheckCircle2, Users, XCircle, Loader2, 
  AlertCircle
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
  const { Language } = useSelector((state) => state.webState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
const {user, isloading, error } = useSelector((state) => state.auth);
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


  // Translations
  const t = useMemo(() => ({
    notAssigned: Language === "AMH" ? "ያልተመደቡ" : "Not Assigned",
    resolved: Language === "AMH" ? "የተፈቱ" : "Resolved",
    rejected: Language === "AMH" ? "ውድቅ የተደረጉ" : "Rejected",
    inProgress: Language === "AMH" ? "በሂደት ላይ" : "In Progress",
    urgent: Language === "AMH" ? "አስቸኳይ ቅሬታ" : "Urgent Complaint",
    distribution: Language === "AMH" ? "የአቤቱታዎች ስርጭት" : "Complaint Distribution"
  }), [Language]);

  // Pie Data
  const chartData = useMemo(() => {
    const others =
      (CompileList?.notAssigned || 0) +
      (CompileList?.resolved || 0) +
      (CompileList?.rejected || 0);

    const inProgress =
      Math.max(0, (CompileList?.totalComplaints || 0) - others);

    return [
      { name: t.notAssigned, value: CompileList?.notAssigned || 0, color: '#8b5cf6' },
      { name: t.resolved, value: CompileList?.resolved || 0, color: '#10b981' },
      { name: t.rejected, value: CompileList?.rejected || 0, color: '#f43f5e' },
      { name: t.inProgress, value: inProgress, color: '#f59e0b' },
    ];
  }, [CompileList, t]);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent === 0) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + r * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="#fff" fontSize={11} fontWeight={900} textAnchor="middle">
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  if (statsLoading || listLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-textColor" size={48} />
      </div>
    );
  }

  // Cards list
  const cards = [
    { title: 'Total', count: CompileList?.totalComplaints, icon: BarChart3 ,type:"list"},
    { title: t.notAssigned, count: CompileList?.notAssigned, icon: UserPlus ,type:"unassigned"},
    { title: t.resolved, count: CompileList?.resolved, icon: CheckCircle2,type:"resolved" },
    { title: t.rejected, count: CompileList?.rejected, icon: XCircle ,type:"rejected"},
    { title:'Urgent Complaint', count: CompileList?.urgentComplaint, icon: AlertCircle, type: 'urgent' },
    { title: 'Active Officers', count: CompileList?.activeOfficers, icon: Users,type:"user" },

 

  ];

  return (
    <div className="flex min-h-screen bg-gray-50/60">
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className="flex-1 pt-32 px-6 lg:px-10 pb-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {/* ================= TOP CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
              {cards.map((card, i) => (
                <SLAWarning
                  key={i}
                  title={card.title}
                  count={card.count}
                  icon={card.icon}
                 onClick={()=>{
                     if(card.type!=="user"){
                    navigate(`/Complaintlist/${user?.role}/${card.type}`)
                    }else{
                      navigate("/userMg")
                    }
                  }}
                  wave={i % 2 === 0 ? 'up' : 'down'} // Alternating wave
                />
              ))}
            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* LEFT: Trend Chart */}
              <div className="xl:col-span-2 bg-white rounded-[3rem] p-8  shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] mb-2">
                  Complaint Trends
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-6">
                  Weekly incoming vs resolution volume
                </p>
                <TrendChart />
              </div>

              {/* RIGHT: Pie Chart */}
              <div className="bg-white rounded-[3rem] p-8  shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] mb-6">
                  {t.distribution}
                </h3>

                <div className="h-[280px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={55}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={renderLabel}
                      >
                        {chartData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" iconType="circle" />
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