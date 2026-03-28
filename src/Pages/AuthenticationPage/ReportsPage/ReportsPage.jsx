import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../Redux/auth';
import toast, { Toaster } from 'react-hot-toast';
import {
  FileBarChart,
  Loader2,
  FileDown,
  ExternalLink,
  Inbox
} from 'lucide-react';

import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import ReportFilters from '../../../Component/AuthenticateComponent/ReportsPageComponent/ReportFilters';

const API_URL = import.meta.env.VITE_API_URL;

const ReportsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { DarkMode } = useSelector((state) => state.webState || {});

  const [departments, setDepartments] = useState([]);
  const [reportsData, setReportsData] = useState({ results: [], count: 0 });
  const [isFetching, setIsFetching] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [filters, setFilters] = useState({
    period: '',
    department: '',
    status: '',
  });

  const queryString = useMemo(() => {
    const activeParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        activeParams[key] = String(value).replace(/\+/g, ' ').trim();
      }
    });
    return new URLSearchParams(activeParams).toString();
  }, [filters]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/departments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        const result = await response.json();
        setDepartments(result.results || result.data || result);
      } catch (err) {
        toast.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  const fetchReports = useCallback(async () => {
    setIsFetching(true);
    try {
      const url = queryString 
        ? `${API_URL}/api/reports/export?${queryString}` 
        : `${API_URL}/api/reports/export`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const result = await response.json();
      setReportsData({
        results: result.results || [],
        count: result.count || 0
      });
    } catch (err) {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }, [queryString]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAuthError = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    navigate('/login');
  };

  const downloadFile = async (type) => {
    const label = type === 'pdf' ? 'PDF' : 'Excel';
    const downloadToast = toast.loading(`Generating ${label}...`);
    setDownloading(true);

    try {
      const endpoint = type === 'pdf' ? '/api/reports/pdf' : '/api/reports/excel';
      const url = queryString 
        ? `${API_URL}${endpoint}?${queryString}` 
        : `${API_URL}${endpoint}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (!response.ok) throw new Error("Failed to generate file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Report_${Date.now()}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success(`${label} Downloaded!`, { id: downloadToast });
    } catch (err) {
      toast.error("Download failed", { id: downloadToast });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50/50 text-slate-900'}`}>
      <Toaster position="top-right" />
      <Sidebar role="manager" />

      <div className="flex-1 flex flex-col">
        <AuthHeader True={true} />

        <main className="flex-1 pt-32 px-6 lg:px-10 pb-10">
          <div className="max-w-7xl mx-auto">
            
            {/* SaaS Header Section */}
            <header className="mb-10 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="h-1.5 w-8 bg-blue-600 rounded-full" />
                   <span className={`text-[11px] font-black capitalize tracking-[0.2em] ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Data intelligence portal</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight">
                  Analytics <span className="text-blue-600">Reports</span>
                </h1>
              </div>
              <div className={`p-4 rounded-3xl shadow-xl transition-all ${DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border`}>
                {isFetching ? <Loader2 className="animate-spin text-blue-600" /> : <FileBarChart className="text-blue-600" size={28} />}
              </div>
            </header>

            <ReportFilters filters={filters} setFilters={setFilters} departments={departments} />

            {/* High Contrast Export Actions */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => downloadFile('pdf')}
                disabled={downloading || isFetching || reportsData.count === 0}
                className="group px-8 py-3.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white text-[11px] font-black capitalize tracking-widest rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-rose-900/20 active:scale-95"
              >
                <FileDown size={18} /> {downloading ? 'Exporting...' : 'Export PDF'}
              </button>
              <button
                onClick={() => downloadFile('excel')}
                disabled={downloading || isFetching || reportsData.count === 0}
                className="group px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white text-[11px] font-black capitalize tracking-widest rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
              >
                <FileDown size={18} /> {downloading ? 'Exporting...' : 'Export Excel'}
              </button>
            </div>

            {/* Table Container */}
            <div className={`mt-8 overflow-hidden relative rounded-[2.5rem] border transition-all ${
              DarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              
              {isFetching && (
                <div className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] ${DarkMode ? 'bg-slate-900/60' : 'bg-white/60'}`}>
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <span className="text-xs font-bold animate-pulse capitalize">Refreshing data...</span>
                  </div>
                </div>
              )}

              <div className={`px-8 py-6 flex justify-between items-center border-b ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h3 className={`text-[11px] font-black capitalize tracking-widest ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Records found: <span className={DarkMode ? 'text-white' : 'text-slate-900'}>{reportsData.count}</span>
                </h3>
                <div className={`text-[10px] font-black px-4 py-2 rounded-xl border capitalize ${
                  DarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                   {filters.period ? filters.period.replace(/\+/g, ' ') : "All history"}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className={`text-[10px] capitalize font-black tracking-widest border-b ${
                    DarkMode ? 'bg-slate-800/50 text-slate-400 border-slate-800' : 'bg-slate-50/50 text-slate-500 border-slate-100'
                  }`}>
                    <tr>
                      <th className="px-8 py-6">Ref number</th>
                      <th className="px-8 py-6">Citizen</th>
                      <th className="px-8 py-6">Category</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${DarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {reportsData.results.map((item) => (
                      <tr key={item.id} className={`transition-colors group ${DarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-blue-50/30'}`}>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1.5 bg-blue-600/10 text-blue-600 rounded-lg font-mono font-bold text-xs border border-blue-600/20">
                            {item.ref_number}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`text-sm font-bold ${DarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.citizen_name}</div>
                           <div className="text-[10px] text-slate-500 font-medium">{item.phone_number}</div>
                        </td>
                        <td className={`px-8 py-6 text-xs font-bold capitalize ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.Category?.name || 'General'}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border capitalize ${
                            item.status === 'SUBMITTED' 
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                            {item.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Link 
                            to={`/DetailList/${item.id}`} 
                            className={`p-2.5 inline-block rounded-xl transition-all ${
                              DarkMode ? 'text-slate-600 hover:text-white hover:bg-slate-800' : 'text-slate-300 hover:text-blue-600 hover:bg-white hover:shadow-md'
                            }`}
                          >
                             <ExternalLink size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {reportsData.results.length === 0 && !isFetching && (
                      <tr>
                        <td colSpan="5" className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-40">
                            <Inbox size={48} />
                            <p className="font-bold text-xs capitalize tracking-[0.2em]">No records found for selected filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;