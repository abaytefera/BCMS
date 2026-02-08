import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// API Hooks
import { useGetAdminStatsQuery, useGetSystemActivityQuery } from '../../../Redux/adminApi';
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
  const { Language } = useSelector((state) => state.webState || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const { data: dep, isLoading: dLoading, error: dError } = useGetDepartmentsQuery();
  const { data: catagory, isLoading: cLoading, error: cError } = useGetCategoriesQuery();
  const {
    data: CompileList,
    isLoading: clLoading,
    error: clError,
  } = useGetComplaintsDashboardQuery('admin');

  // Scroll top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle 401 Unauthorized
  useEffect(() => {
    const errors = [ dError, cError, clError];
    const isUnauthorized = errors.some(err => err?.status === 401);

    if (isUnauthorized) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [  dError, cError, clError, dispatch, navigate]);

  const isLoading =
   dLoading || cLoading || clLoading;

  const t = {
    title: Language === "AMH" ? "የአስተዳዳሪ ዳሽቦርድ" : "Admin Dashboard",
    subtitle:
      Language === "AMH"
        ? "የአካባቢ ጥበቃ ባለሥልጣን አጠቃላይ እይታ"
        : "EPA Global System Overview",
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-textColor" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-x-hidden bg-gray-50/40">
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <AuthHeader True={true} />

        <main className="flex-1 overflow-y-auto pt-32 px-6 lg:px-10 pb-24 space-y-10">
          <div className="max-w-7xl mx-auto">

            {/* ================= PAGE HEADER ================= */}
            <div>
              <h1 className="text-4xl font-black text-textColor tracking-tight capitalize">
                {t.title}
              </h1>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-3">
                <span className="w-10 h-[2px] bg-primBtn"></span>
                {t.subtitle}
              </p>
            </div>

            {/* ================= TOP CARDS ================= */}
            <div className="mt-10">
              <AdminStats CompileList={CompileList} />
            </div>

            {/* ================= CHART + SUMMARY ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start mt-12">

              {/* LEFT: MAIN DASHBOARD CHART */}
              <div className="xl:col-span-2 bg-white rounded-[3rem] p-8 shadow-sm ">
                <AdminDashboardChart
                  data={CompileList}
                  language={Language}
                />
              </div>

              {/* RIGHT: SYSTEM SUMMARY */}
              <div className="bg-white rounded-[3rem] p-8 shadow-sm  h-fit">
                <SystemSummary
                  catagory={catagory?.length}
                  dep={dep?.length}
                />
              </div>

            </div>

            {/* ================= DEPARTMENT / CATEGORY ================= */}
            <div className="mt-12">
              <DepartmentCircularChart />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;