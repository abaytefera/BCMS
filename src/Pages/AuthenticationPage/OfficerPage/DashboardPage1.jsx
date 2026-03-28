import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from 'react-hot-toast'; 
import { Loader2, ClipboardList, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// API Hooks
import { useGetOfficerStatsQuery } from '../../../Redux/officerApi';
import { useGetComplaintsDashboardQuery } from '../../../Redux/complaintApi';

// Components
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import StatCard from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/StatCard';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import OfficerOverviewChart from './OfficerOverviewChart'; 
import { logout } from '../../../Redux/auth';

const OfficerPage1 = () => {
  const { Language, DarkMode } = useSelector((state) => state.webState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { error: statsError } = useGetOfficerStatsQuery();
  const { data: CompileList, isLoading: isLoadingCompiletask, error: compileError } =
    useGetComplaintsDashboardQuery('officer');

  // SaaS Standard: Using capitalize instead of uppercase
  const t = {
    live: Language === "AMH" ? "ቀጥታ" : "Live",
    pageTitle: Language === "AMH" ? "ዳሽቦርድ" : "Dashboard overview",
    statAssigned: Language === "AMH" ? "የተመደቡ" : "Assigned cases",
    statProgress: Language === "AMH" ? "በሂደት ላይ" : "In progress",
    statOverdue: Language === "AMH" ? "ጊዜ ያለፈባቸው" : "Overdue tasks",
    statResolved: Language === "AMH" ? "የተፈቱ" : "Resolved items",
    statRejected: Language === "AMH" ? "ውድቅ የተደረጉ" : "Rejected cases",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ 401 Auth Guard
  useEffect(() => {
    if (statsError?.status === 401 || compileError?.status === 401) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [statsError, compileError, dispatch, navigate]);

  if (isLoadingCompiletask) return (
    <div className={`min-h-screen flex items-center justify-center ${DarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primBtn" size={48} strokeWidth={2.5} />
        <span className={`text-xs font-black capitalize tracking-widest ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Initializing dashboard...
        </span>
      </div>
    </div>
  );

  // High Contrast Status Mapping
  const cards = [
    { title: t.statAssigned, count: CompileList?.assigned, icon: ClipboardList, type: "assigned" },
    { title: t.statProgress, count: CompileList?.inProgress, icon: Clock, type: "in_progress" },
    { title: t.statResolved, count: CompileList?.resolved, icon: CheckCircle, type: "resolved" },
    { title: t.statRejected, count: CompileList?.rejected, icon: XCircle, type: "rejected" },
    { title: t.statOverdue, count: CompileList?.overdue, icon: AlertCircle, type: "overdue" },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${
      DarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50/50 text-slate-900'
    }`}>
      <Toaster position="top-right" />
      <Sidebar role="OFFICER" />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AuthHeader True={true} />

        <main className="flex-1 overflow-y-auto pt-32 px-6 lg:px-12 pb-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header Section */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    DarkMode ? 'bg-primBtn/10 border-primBtn/20' : 'bg-primBtn/5 border-primBtn/10'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-primBtn animate-pulse" />
                    <span className="text-[10px] font-black capitalize tracking-[0.15em] text-primBtn">
                       system status
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight capitalize leading-tight">
                  {t.pageTitle}
                </h1>
              </div>

             
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-12">
              {cards.map((card, i) => (
                <StatCard
                  key={i}
                  title={card.title}
                  count={card.count || 0}
                  icon={card.icon}
                  type={card.type}
                  onClick={() => navigate(`/Complaintlist/${user?.role}/${card.type}`)}
                  wave={i % 2 === 0 ? 'up' : 'down'}
                  delay={i * 0.1}
                />
              ))}
            </div>

            {/* Analytics Section */}
            <div className={`rounded-[3rem] p-10 border transition-all duration-700 ${
              DarkMode 
                ? 'bg-slate-900 border-slate-800 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)]' 
                : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black capitalize tracking-tight">Performance analytics</h2>
                  <p className={`text-xs font-bold ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Real-time data visualization for officer productivity
                  </p>
                </div>
                <div className={`self-start px-5 py-2 rounded-2xl text-[10px] font-black capitalize border tracking-widest ${
                  DarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                }`}>
                  Current period
                </div>
              </div>
              
              <div className="w-full min-h-[400px]">
                <OfficerOverviewChart data={CompileList} t={t} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerPage1;