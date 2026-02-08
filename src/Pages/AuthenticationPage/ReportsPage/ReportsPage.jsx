import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../Redux/auth';
import toast, { Toaster } from 'react-hot-toast';
import {
  FileBarChart,
  Loader2,
  FileDown,
  ExternalLink
} from 'lucide-react';

import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import ReportFilters from '../../../Component/AuthenticateComponent/ReportsPageComponent/ReportFilters';

const API_URL = import.meta.env.VITE_API_URL;

const ReportsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- State ---
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

  // --- 2. Load Departments ---
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

  // --- 3. Fetch Data Logic ---
  const fetchReports = useCallback(async () => {
    setIsFetching(true);
    try {
      const url = queryString 
        ? `${API_URL}/api/reports/export?${queryString}` 
        : `${API_URL}/api/reports/export`;

      console.log("Current Query:", queryString);
      
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

  // Trigger fetch whenever parameters change
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAuthError = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    navigate('/login');
  };

  // --- 4. Download Logic ---
  const downloadFile = async (type) => {
    const downloadToast = toast.loading(`Generating ${type.toUpperCase()}...`);
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
      
      toast.success(`${type.toUpperCase()} Downloaded!`, { id: downloadToast });
    } catch (err) {
      toast.error("Download failed", { id: downloadToast });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Toaster position="top-right" />
      <Sidebar role="manager" />

      <div className="flex-1 flex flex-col">
        <AuthHeader True={true} />

        <main className="flex-1 pt-32 px-6 lg:px-10 pb-10">
          <div className="max-w-7xl mx-auto">
            
            <header className="mb-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">
                  Analytics <span className="text-textColor">Reports</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Data Intelligence Portal</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                {isFetching ? <Loader2 className="animate-spin text-blue-600" /> : <FileBarChart className="text-blue-600" />}
              </div>
            </header>

            <ReportFilters filters={filters} setFilters={setFilters} departments={departments} />

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => downloadFile('pdf')}
                disabled={downloading || isFetching || reportsData.count === 0}
                className="group px-8 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-rose-100"
              >
                <FileDown size={16} /> {downloading ? 'Exporting...' : 'Export PDF'}
              </button>
              <button
                onClick={() => downloadFile('excel')}
                disabled={downloading || isFetching || reportsData.count === 0}
                className="group px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-emerald-100"
              >
                <FileDown size={16} /> {downloading ? 'Exporting...' : 'Export Excel'}
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] mt-8 overflow-hidden shadow-sm relative">
              {isFetching && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              )}

              <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Records Found: <span className="text-slate-900">{reportsData.count}</span>
                </h3>
                <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 uppercase">
                   {filters.period ? filters.period.replace(/\+/g, ' ') : "All History"}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[9px] uppercase font-black text-slate-500 tracking-wider">
                    <tr>
                      <th className="px-8 py-5">Ref Number</th>
                      <th className="px-8 py-5">Citizen</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportsData.results.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-5 text-blue-600 font-mono font-bold text-xs uppercase">
                          {item.ref_number}
                        </td>
                        <td className="px-8 py-5">
                           <div className="text-sm font-bold text-slate-700">{item.citizen_name}</div>
                           <div className="text-[10px] text-slate-400 font-medium">{item.phone_number}</div>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-500">
                          {item.Category?.name || 'General'}
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border ${
                            item.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Link to={`/DetailList/${item.id}`} className="p-2 inline-block text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all">
                             <ExternalLink size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {reportsData.results.length === 0 && !isFetching && (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                          No records found for selected filters
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