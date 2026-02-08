import React, { useEffect } from 'react';
import { Activity, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../Redux/auth';

import {
  useGetManagementStatsQuery,
  useGetDashboardChartsQuery
} from '../../../Redux/managementApi';
import { useGetComplaintsDashboardQuery } from '../../../Redux/complaintApi';

import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import TrendChart from '../../../Component/AuthenticateComponent/ManagementDashboardComponent/TrendChart';
import ResolutionPie from '../../../Component/AuthenticateComponent/ManagementDashboardComponent/ResolutionPie';
import DepartmentCircularChart from '../../../Component/AuthenticateComponent/AdminDashboardComponent/DepartmentCatagory';
import StatCard from './StatCard';

const ManagementDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: stats, isLoading: statsLoading, error: statsError } = useGetManagementStatsQuery();
  const { data: charts, isLoading: chartsLoading, error: chartsError } = useGetDashboardChartsQuery();
  const { data: CompileList, isLoading: isLoadingCompile, error: compileError } = useGetComplaintsDashboardQuery('management');

  useEffect(() => {
    const errors = [statsError, chartsError, compileError];
    const isUnauthorized = errors.some(err => err?.status === 401);
    if (isUnauthorized) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [statsError, chartsError, compileError, navigate, dispatch]);

  useEffect(() => window.scrollTo(0, 0), []);

  const totalComplaints = CompileList?.summary?.total ?? stats?.total ?? 0;
  const slaCompliance = `${CompileList?.percentage ?? stats?.sla ?? 0}%`;
  const userSatisfaction = CompileList?.satisfaction?.averageSatisfaction ?? 0;

  // Card definitions
  const cards = [
    { title: "Complaints", value: totalComplaints, icon: Activity, gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500', onClick: () => navigate("/Complaintlist/admin/list/") },
    { title: "SLA Compliance", value: slaCompliance, icon: ShieldCheck, gradient: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500', onClick: () => {} },
    { title: "User Satisfaction", value: `${userSatisfaction}%`, icon: Heart, gradient: 'bg-gradient-to-br from-rose-400 via-rose-500 to-pink-500', onClick: () => {} },
  ];

  const resolutionData = [
    { name: 'Resolved', value: CompileList?.summary?.resolved ?? 0, colorStart: '#34d399', colorEnd: '#10b981' },
    { name: 'Closed', value: CompileList?.summary?.closed ?? 0, colorStart: '#60a5fa', colorEnd: '#3b82f6' },
    { name: 'Rejected', value: CompileList?.summary?.rejected ?? 0, colorStart: '#f87171', colorEnd: '#ef4444' },
    { name: 'In Progress', value: CompileList?.summary?.inprogress ?? 0, colorStart: '#facc15', colorEnd: '#f59e0b' },
  ];

  if (statsLoading || chartsLoading || isLoadingCompile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-textColor" size={48} />
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

            {/* ================= TOP CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {cards.map((card, i) => (
                <StatCard
                  key={i}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  gradient={card.gradient}
                  onClick={card.onClick}
                  wave={i % 2 === 0 ? 'up' : 'down'}
                  delay={i * 0.2}
                />
              ))}
            </div>

            {/* ================= TREND CHART LEFT & PIE CHART RIGHT ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Trend Chart */}
              <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-2">
                  Complaint Trends
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-6">
                  Weekly incoming vs resolution volume
                </p>
                <TrendChart />
              </div>

              {/* Pie Chart */}
              <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-6">
                  Resolution Status
                </h3>
                <div className="h-[300px]">
                  <ResolutionPie data={resolutionData} />
                </div>
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