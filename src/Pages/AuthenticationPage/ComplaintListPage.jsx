import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Search, ListFilter, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/auth';
import { useGetComplaintsbyCatagoryQuery } from '../../Redux/complaintApi';
import Sidebar from '../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import ComplaintRow from '../../Component/AuthenticateComponent/ComplaintListPageComponent/ComplaintRow';
import AuthHeader from '../../Component/AuthenticateComponent/AuthHeader';

const ComplaintListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { Language } = useSelector((state) => state.webState);
  const { user } = useSelector((state) => state.auth);

  const { role, type } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  // ===== RTK QUERY =====
  const {
    data: TotalCompile,
    isLoading,
    isFetching,
    error
  } = useGetComplaintsbyCatagoryQuery(
    { role, type },
    { skip: !role || !type }
  );

  // ===== 401 HANDLER =====
  useEffect(() => {
    if (error?.status === 401) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [error, dispatch, navigate]);

  // ===== NO FILTER – ONLY SEARCH =====
  const filteredComplaints = useMemo(() => {
    if (!Array.isArray(TotalCompile)) return [];

    let list = [...TotalCompile].filter(item => item && typeof item === "object");

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      list = list.filter(item =>
        item?.ref_number?.toLowerCase().includes(lowerSearch) ||
        item?.citizen_name?.toLowerCase().includes(lowerSearch)
      );
    }

    return list;
  }, [TotalCompile, searchTerm]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white text-slate-800">
      <Sidebar role={user?.role?.toLowerCase() || "all"} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AuthHeader True={true} />

        <main className="flex-grow pt-20 px-6 lg:px-10 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">

            {/* ===== HEADER ===== */}
            <header className="relative top-10">
              <h1 className="text-2xl font-black capitalize">
                Complaints <span className="text-textColor">{type}</span>
              </h1>
            </header>

            {/* ===== SEARCH ONLY ===== */}
            <div className="flex justify-end mb-10">
              <div className="relative w-full md:w-96">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    Language === "AMH"
                      ? "መከታተያ መለያ ፈልግ..."
                      : "Search tracking ID..."
                  }
                  className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl outline-none text-sm"
                />
              </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden mb-10">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <ListFilter className="text-emerald-600" size={18} />
                <span className="text-xs font-black uppercase tracking-widest italic text-slate-800">
                  {Language === "AMH" ? "ጠቅላላ መዝግቦች" : "Total Records"} (
                  {filteredComplaints.length})
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-5 border-b border-slate-100">Tracking ID</th>
                      <th className="px-8 py-5 border-b border-slate-100">Citizen</th>
                      <th className="px-8 py-5 border-b border-slate-100">Status</th>
                      <th className="px-8 py-5 border-b border-slate-100 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {isLoading || isFetching ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-24 text-center">
                          <Loader2 className="h-10 w-10 animate-spin text-textColor mx-auto" />
                          <p>loading Complaints {type} </p>
                        </td>
                      </tr>
                    ) : filteredComplaints.length > 0 ? (
                      filteredComplaints.map((item) => (
                        <ComplaintRow
                          key={item?.id || item?._id}
                          complaint={item}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-8 py-20 text-center text-slate-400 uppercase font-black text-[10px] tracking-widest"
                        >
                          {Language === "AMH"
                            ? "መዝግቦች አልተገኙም"
                            : "No Records Found"}
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