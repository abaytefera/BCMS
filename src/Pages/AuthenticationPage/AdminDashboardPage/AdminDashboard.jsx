import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Loader2, LayoutDashboard } from 'lucide-react';

// API Hooks
import { useGetDepartmentsQuery } from '../../../Redux/departmentApi';
import { useGetCategoriesQuery } from '../../../Redux/categoryApi';
import { useGetComplaintsDashboardQuery } from '../../../Redux/complaintApi';

// Components
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import AdminStats from '../../../Component/AuthenticateComponent/AdminDashboardComponent/AdminStats';
import SystemSummary from '../../../Component/AuthenticateComponent/AdminDashboardComponent/SystemSummary';
import AdminDashboardChart from '../../../Component/AuthenticateComponent/AdminDashboardComponent/AdminDashboardChart';
import DepartmentCircularChart from '../../../Component/AuthenticateComponent/AdminDashboardComponent/DepartmentCatagory';

// Redux
import { logout } from '../../../Redux/auth';

const AdminDashboard = () => {
  // Access Language and DarkMode from your Redux state
  const { Language, DarkMode } = useSelector((state) => state.webState || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: dep, isLoading: dLoading, error: dError } = useGetDepartmentsQuery();
  const { data: catagory, isLoading: cLoading, error: cError } = useGetCategoriesQuery();
  const {
    data: CompileList,
    isLoading: clLoading,
    error: clError,
  } = useGetComplaintsDashboardQuery('admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const errors = [dError, cError, clError];
    const isUnauthorized = errors.some(err => err?.status === 401);

    if (isUnauthorized) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [dError, cError, clError, dispatch, navigate]);

  const isLoading = dLoading || cLoading || clLoading;

  const t = {
    title: Language === "AMH" ? "የአስተዳዳሪ ዳሽቦርድ" : "Admin Dashboard",
    subtitle: Language === "AMH" ? "የአካባቢ ጥበቃ ባለሥልጣን አጠቃላይ እይታ" : "EPA Global System Overview",
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <Loader2 className="animate-spin text-primBtn" size={48} />
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50/50 text-slate-900'}`}>
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <AuthHeader True={true} />

        <main className="flex-1 overflow-y-auto pt-24 px-6 lg:px-10 pb-20 no-scrollbar">
          <div className="max-w-7xl mx-auto py-8">

            {/* ================= PAGE HEADER ================= */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-2 rounded-lg bg-primBtn/10 text-primBtn">
                      <LayoutDashboard size={20} />
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Overview</span>
                </div>
                <h1 className={`text-4xl font-black tracking-tight capitalize ${DarkMode ? 'text-white' : 'text-textColor'}`}>
                  {t.title}
                </h1>
               
              </div>
              
              {/* Optional Date display for Professional Look */}
              <div className={`hidden lg:block text-right ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                
                  
              </div>
            </div>

            {/* ================= TOP CARDS (Stats) ================= */}
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AdminStats CompileList={CompileList} />
            </div>

            {/* ================= CHART + SUMMARY ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch mb-10">

              {/* LEFT: MAIN DASHBOARD CHART */}
              <div className={`xl:col-span-2 rounded-[2.5rem] p-8 shadow-sm border transition-all hover:shadow-md
                ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200'}
              `}>
                <AdminDashboardChart
                  data={CompileList}
                  language={Language}
                />
              </div>

              {/* RIGHT: SYSTEM SUMMARY */}
              <div className={`rounded-[2.5rem] p-8 shadow-sm border transition-all hover:shadow-md
                ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200'}
              `}>
                <SystemSummary
                  catagory={catagory?.length}
                  dep={dep?.length}
                />
              </div>
            </div>

            {/* ================= DEPARTMENT / CATEGORY ================= */}
            <div className={`rounded-[2.5rem] p-8 shadow-sm border mb-10
                ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200'}
            `}>
               <DepartmentCircularChart />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;