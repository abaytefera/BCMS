import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Search, ListFilter, Loader2, Database, LayoutGrid } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/auth';
import { useGetComplaintsbyCatagoryQuery } from '../../Redux/complaintApi';
import { 
  useGetMeetingsByStatusQuery, 
  useGetScheduledMeetingsQuery, 
  useGetExecutiveStatsQuery 
} from '../../Redux/secreatryApi';

import Sidebar from '../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import ComplaintRow from '../../Component/AuthenticateComponent/ComplaintListPageComponent/ComplaintRow';
import AuthHeader from '../../Component/AuthenticateComponent/AuthHeader';

const ComplaintListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Language, DarkMode } = useSelector((state) => state.webState || {});
  const { user } = useSelector((state) => state.auth);

  const { role, type, value } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  // ===== DYNAMIC API LOGIC (Unchanged) =====
  const complaintQuery = useGetComplaintsbyCatagoryQuery(
    { role, type },
    { skip: role === 'secretary' || role === 'executive' || !role || !type }
  );

  const secretaryStatusQuery = useGetMeetingsByStatusQuery(value, {
    skip: role !== 'secretary' || type !== 'status'
  });

  const timeframeQuery = useGetScheduledMeetingsQuery(value, {
    skip: role !== 'secretary' || type !== 'timeframe'
  });

  const category = value === 'completed' ? 'meetings' : 'complaints';
  const execStatQuery = useGetExecutiveStatsQuery(
    { category, status: value }, 
    { skip: role !== 'secretary' || type !== 'stat' }
  );

  const activeRequest = useMemo(() => {
    if (role === 'secretary') {
      if (type === 'status') return secretaryStatusQuery;
      if (type === 'timeframe') return timeframeQuery;
      if (type === 'stat') return execStatQuery;
    }
    return complaintQuery;
  }, [role, type, secretaryStatusQuery, timeframeQuery, execStatQuery, complaintQuery]);

  const { data: rawData, isLoading, isFetching, error } = activeRequest;

  useEffect(() => {
    if (error?.status === 401) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [error, dispatch, navigate]);

  const filteredData = useMemo(() => {
    const list = Array.isArray(rawData) ? rawData : (rawData?.data || []);
    if (!searchTerm) return list;

    const lowerSearch = searchTerm.toLowerCase();
    return list.filter(item =>
      item?.ref_number?.toLowerCase().includes(lowerSearch) ||
      item?.citizen_name?.toLowerCase().includes(lowerSearch) ||
      item?.category?.toLowerCase().includes(lowerSearch) ||
      item?.title?.toLowerCase().includes(lowerSearch)
    );
  }, [rawData, searchTerm]);

  if (!user) return null;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
      <Sidebar role={user?.role?.toLowerCase() || "all"} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AuthHeader True={true} />

        <main className={`flex-grow pt-28 px-6 lg:px-10 overflow-y-auto transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
          <div className="max-w-7xl mx-auto">

            {/* ===== PROFESSIONAL HEADER ===== */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${DarkMode ? 'bg-primBtn/10 text-primBtn' : 'bg-primBtn/5 text-primBtn'}`}>
                    <Database size={18} />
                  </div>
                  <span className={`text-[11px] font-black capitalize tracking-widest ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {role} management view
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black capitalize tracking-tight">
                  {role === 'secretary' ? value?.replace('_', ' ') : type} <span className="text-primBtn">records</span>
                </h1>
              </div>

              {/* ===== SEARCH INPUT ===== */}
              <div className="relative w-full md:w-96 group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${DarkMode ? 'text-slate-600 group-focus-within:text-primBtn' : 'text-slate-400 group-focus-within:text-primBtn'}`} size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={Language === "AMH" ? "ፈልግ..." : "Search records..."}
                  className={`w-full py-3.5 pl-12 pr-4 rounded-2xl outline-none text-sm border transition-all duration-300 shadow-sm
                    ${DarkMode 
                      ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-primBtn/50 focus:ring-4 focus:ring-primBtn/5' 
                      : 'bg-white border-slate-200 text-slate-800 focus:border-primBtn/30 focus:ring-4 focus:ring-primBtn/5'}`}
                />
              </div>
            </header>

            {/* ===== TABLE CONTAINER ===== */}
            <div className={`border rounded-[2.5rem] shadow-xl overflow-hidden mb-12 transition-all duration-300 
              ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
              
              <div className={`px-10 py-6 border-b flex items-center justify-between transition-colors 
                ${DarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-slate-50/30'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${DarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    <ListFilter size={16} />
                  </div>
                  <span className={`text-[11px] font-black capitalize tracking-wider ${DarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {Language === "AMH" ? "ጠቅላላ" : "Active listings"} ({filteredData.length})
                  </span>
                </div>
                {isFetching && <Loader2 className="animate-spin text-primBtn" size={18} />}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className={`text-[11px] font-black capitalize tracking-wider transition-colors
                    ${DarkMode ? 'bg-slate-900/80 text-slate-500' : 'bg-slate-50/50 text-slate-400'}`}>
                    <tr>
                      <th className="px-10 py-5 border-b border-transparent">Reference / id</th>
                      <th className="px-10 py-5 border-b border-transparent">Subject / citizen</th>
                      <th className="px-10 py-5 border-b border-transparent">Status</th>
                      <th className="px-10 py-5 border-b border-transparent text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className={`divide-y transition-colors ${DarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="px-10 py-32 text-center">
                          <Loader2 className="h-12 w-12 animate-spin text-primBtn mx-auto mb-6" />
                          <p className={`text-[11px] font-black capitalize tracking-[0.2em] ${DarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                         Loading database...
                          </p>
                        </td>
                      </tr>
                    ) : filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <ComplaintRow
                          key={item?.id || item?._id}
                          complaint={item}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-10 py-24 text-center">
                          <LayoutGrid size={48} className={`mx-auto mb-4 opacity-10 ${DarkMode ? 'text-white' : 'text-slate-900'}`} />
                          <p className={`text-xs font-black capitalize tracking-widest ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                            {Language === "AMH" ? "ምንም አልተገኘም" : "No records match your criteria"}
                          </p>
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

export default ComplaintListPage;