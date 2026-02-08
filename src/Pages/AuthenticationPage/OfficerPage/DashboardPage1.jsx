import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from 'react-hot-toast'; 
import { Loader2, ClipboardList, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// API Hooks
import { useGetOfficerStatsQuery } from '../../../Redux/officerApi';
import { useGetComplaintsDashboardQuery } from '../../../Redux/complaintApi';

// Components
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import StatCard from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/StatCard';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import OfficerOverviewChart from './OfficerOverviewChart'; // Graph
import { logout } from '../../../Redux/auth';

const OfficerPage1 = () => {
  const { Language } = useSelector((state) => state.webState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user, isloading, error } = useSelector((state) => state.auth);

  const { isLoading: isLoadingStats, error: statsError } = useGetOfficerStatsQuery();
  const { data: CompileList, isLoading: isLoadingCompiletask, error: compileError } =
    useGetComplaintsDashboardQuery('officer');

  const t = {
    live: Language === "AMH" ? "ቀጥታ" : "Live",
    pageTitle: Language === "AMH" ? "ዳሽቦርድ" : "Dashboard",
    statAssigned: Language === "AMH" ? "የተመደቡ" : "Assigned",
    statProgress: Language === "AMH" ? "በሂደት ላይ" : "In Progress",
    statOverdue: Language === "AMH" ? "ጊዜ ያለፈባቸው" : "Overdue",
    statResolved: Language === "AMH" ? "የተፈቱ" : "Resolved",
    statRejected: Language === "AMH" ? "ውድቅ የተደረጉ" : "Rejected",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ 401 redirect
  useEffect(() => {
    if (statsError?.status === 401 || compileError?.status === 401) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [statsError, compileError, navigate]);

  if (isLoadingCompiletask) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="animate-spin text-textColor" size={48} />
    </div>
  );

  // Cards data
  const cards = [
    { title: t.statAssigned, count: CompileList?.assigned, icon: ClipboardList, type: "assigned" },
    { title: t.statProgress, count: CompileList?.inProgress, icon: Clock, type: "in_progress" },
    { title: t.statResolved, count: CompileList?.resolved, icon: CheckCircle, type: "resolved" },
    { title: t.statRejected, count: CompileList?.rejected, icon: XCircle, type: "rejected" },
    { title: t.statOverdue, count: CompileList?.overdue, icon: AlertCircle, type: "overdue" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50 text-gray-900">
      <Toaster position="top-right" />
      <Sidebar role="OFFICER" />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AuthHeader True={true} />

        <main className="flex-1 overflow-y-auto pt-32 px-6 lg:px-10 pb-10">
          <div className="max-w-7xl mx-auto">

            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
              {cards.map((card, i) => (
                <StatCard
                  key={i}
                  title={card.title}
                  count={card.count}
                  icon={card.icon}
                  type={card.type}
                  onClick={()=>{
                   
                    navigate(`/Complaintlist/${user?.role}/${card.type}`)
                  
                  }}
                  wave={i % 2 === 0 ? 'up' : 'down'} // wave up/down alternate
                  delay={i * 0.2} // stagger animation
                />
              ))}
            </div>

            {/* Graph */}
            <div className="bg-white rounded-2xl p-8 shadow-sm ">
              <OfficerOverviewChart data={CompileList} t={t} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerPage1;