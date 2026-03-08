import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Search, ListFilter, Loader2, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/auth';
// Import your existing and new API hooks
import { useGetComplaintsbyCatagoryQuery } from '../../Redux/complaintApi';
import { 
  useGetMeetingsByStatusQuery, 
  useGetScheduledMeetingsQuery, 
  useGetExecutiveStatsQuery 
} from '../../Redux/secreatryApi';; // Adjust path based on where you put the new hooks

import Sidebar from '../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import ComplaintRow from '../../Component/AuthenticateComponent/ComplaintListPageComponent/ComplaintRow';
import AuthHeader from '../../Component/AuthenticateComponent/AuthHeader';

const ComplaintListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Language } = useSelector((state) => state.webState);
  const { user } = useSelector((state) => state.auth);

  // Params from Sidebar: /secretary/list/:type/:value
  // or existing /complaints/:role/:type
  const { role, type, value } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
 

  // ===== DYNAMIC API LOGIC =====
  // 1. Existing Complaint Query
  const complaintQuery = useGetComplaintsbyCatagoryQuery(
    { role, type },
    { skip: role === 'secretary' || role === 'executive' || !role || !type }
  );

  // 2. New Secretary Status Query (PENDING, APPROVED, etc)
  const secretaryStatusQuery = useGetMeetingsByStatusQuery(value, {
    skip: role !== 'secretary' || type !== 'status'
  });

  // 3. New Timeframe Query (today, week)
  const timeframeQuery = useGetScheduledMeetingsQuery(value, {
    skip: role !== 'secretary' || type !== 'timeframe'
  });

  // 4. New Executive Stats Query (escalated, completed)
 
  // Determine the category based on your component's logic
const category = value === 'completed' ? 'meetings' : 'complaints';

const execStatQuery = useGetExecutiveStatsQuery(
  { category, status: value }, 
  { skip: role !== 'secretary' || type !== 'stat' }
);

  // ===== SELECT ACTIVE DATA SOURCE =====
  const activeRequest = useMemo(() => {
    if (role === 'secretary') {
      if (type === 'status') return secretaryStatusQuery;
      if (type === 'timeframe') return timeframeQuery;
      if (type === 'stat') return execStatQuery;
    }
    return complaintQuery;
  }, [role, type, secretaryStatusQuery, timeframeQuery, execStatQuery, complaintQuery]);

  const { data: rawData, isLoading, isFetching, error } = activeRequest;

  // ===== 401 HANDLER =====
  useEffect(() => {
    if (error?.status === 401) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [error, dispatch, navigate]);

  // ===== SEARCH & FILTER =====
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
  useEffect(()=>{
    console.log(filteredData)

  },[filteredData])

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white text-slate-800">
      <Sidebar role={user?.role?.toLowerCase() || "all"} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AuthHeader True={true} />

        <main className="flex-grow pt-20 px-6 lg:px-10 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">

            {/* ===== HEADER ===== */}
            <header className="relative top-10 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black capitalize">
                  {role === 'secretary' ? value?.replace('_', ' ') : type} <span className="text-textColor">Records</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
                  {role} Management View
                </p>
              </div>
            </header>

            {/* ===== SEARCH ===== */}
            <div className="flex justify-end max-md:mb-10 md:mb-10">
              <div className="relative w-full  max-md:mt-4 md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={Language === "AMH" ? "ፈልግ..." : "Search record..."}
                  className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl outline-none text-sm shadow-sm focus:border-textColor transition-all"
                />
              </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden mb-10">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ListFilter className="text-emerald-600" size={18} />
                  <span className="text-xs font-black uppercase tracking-widest italic text-slate-800">
                    {Language === "AMH" ? "ጠቅላላ" : "Total"} ({filteredData.length})
                  </span>
                </div>
                {isFetching && <Loader2 className="animate-spin text-textColor" size={16} />}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-5 border-b border-slate-100">Reference / ID</th>
                      <th className="px-8 py-5 border-b border-slate-100">Subject / Citizen</th>
                      <th className="px-8 py-5 border-b border-slate-100">Status</th>
                      <th className="px-8 py-5 border-b border-slate-100 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-24 text-center">
                          <Loader2 className="h-10 w-10 animate-spin text-textColor mx-auto mb-4" />
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching Data...</p>
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
                        <td colSpan="5" className="px-8 py-20 text-center text-slate-400 uppercase font-black text-[10px] tracking-widest">
                          {Language === "AMH" ? "ምንም አልተገኘም" : "No Records Found"}
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