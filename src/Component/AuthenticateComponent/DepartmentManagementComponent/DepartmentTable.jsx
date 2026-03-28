import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  Edit3, 
  Search, 
  Building2, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle,
  Trash2,
} from "lucide-react";

const DepartmentTable = ({ data = [], onEdit, onToggleStatus, onDelete }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmToggle, setConfirmToggle] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredData = data.filter((dept) => {
    const searchStr = searchTerm.toLowerCase();
    return dept.name?.toLowerCase().includes(searchStr);
  });

  const handleToggleClick = (dept) => setConfirmToggle(dept);

  const confirmAction = () => {
    if (confirmToggle) {
      onToggleStatus({ 
        id: confirmToggle.id || confirmToggle._id, 
        is_active: confirmToggle.is_active 
      });
      setConfirmToggle(null);
    }
  };

  const confirmDeletion = () => {
    if (confirmDelete) {
      onDelete(confirmDelete.id || confirmDelete._id);
      setConfirmDelete(null);
    }
  };

  const cardBg = DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const tableHeaderBg = DarkMode ? 'bg-slate-900/50' : 'bg-slate-50/50';

  return (
    <div className="flex flex-col gap-8 font-sans relative">
      
      {/* ================= MODAL: STATUS TOGGLE ================= */}
      {confirmToggle && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${cardBg} rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center transform animate-in zoom-in-95 duration-300 border`}>
            <div className={`mb-6 p-5 rounded-[2rem] ${confirmToggle.is_active ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <AlertTriangle size={44} strokeWidth={1.5} />
            </div>
            
            <h3 className={`text-2xl font-black tracking-tight capitalize ${DarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Adjust status?</h3>
            <p className={`mt-3 text-sm leading-relaxed ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Confirm the {confirmToggle.is_active ? 'deactivation' : 'activation'} of 
              <span className="block font-bold text-primBtn mt-1 italic capitalize">"{confirmToggle.name}"</span>
            </p>

            <div className="flex gap-3 w-full mt-10">
              <button onClick={() => setConfirmToggle(null)} className={`flex-1 py-4 rounded-2xl font-black text-[11px] capitalize tracking-wider transition-all ${DarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                Go back
              </button>
              <button onClick={confirmAction} className={`flex-1 py-4 rounded-2xl text-white font-black text-[11px] capitalize tracking-wider shadow-xl active:scale-95 transition-all ${confirmToggle.is_active ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-rose-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${cardBg} rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border-rose-500/20 flex flex-col items-center text-center transform animate-in zoom-in-95 duration-300 border`}>
            <div className="mb-6 p-5 rounded-[2rem] bg-rose-500/10 text-rose-500">
              <Trash2 size={44} strokeWidth={1.5} />
            </div>
            <h3 className={`text-2xl font-black tracking-tight capitalize ${DarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Delete dept?</h3>
            <p className={`mt-3 text-sm leading-relaxed ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              This action is permanent and will remove all associated categories. Are you sure?
              <span className="block font-bold text-rose-500 mt-1 italic capitalize">"{confirmDelete.name}"</span>
            </p>
            <div className="flex gap-3 w-full mt-10">
              <button onClick={() => setConfirmDelete(null)} className={`flex-1 py-4 rounded-2xl font-black text-[11px] capitalize tracking-wider transition-all ${DarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                Cancel
              </button>
              <button onClick={confirmDeletion} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black text-[11px] capitalize tracking-wider shadow-xl shadow-rose-600/20 active:scale-95 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div className="relative w-full max-w-md group">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${DarkMode ? 'text-slate-600 group-focus-within:text-primBtn' : 'text-slate-400 group-focus-within:text-primBtn'}`} />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all duration-300 shadow-sm
              ${DarkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-primBtn/50 focus:ring-4 focus:ring-primBtn/5' 
                : 'bg-white border-slate-200 text-slate-900 focus:border-primBtn/30 focus:ring-4 focus:ring-primBtn/5'}`}
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className={`hidden md:block border rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300
        ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
        <table className="w-full text-left">
          <thead className={`border-b text-[11px] font-black capitalize tracking-wider ${tableHeaderBg} ${DarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <tr>
              <th className="px-10 py-6">Department identity</th>
              <th className="px-10 py-6">Status</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${DarkMode ? 'divide-slate-800/50' : 'divide-slate-50'}`}>
            {filteredData.map((dept) => (
              <tr key={dept.id || dept._id} className={`${DarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'} transition-all`}>
                <td className="px-10 py-7">
                  <div className="flex items-center gap-5">
                    <div className={`p-3.5 rounded-2xl transition-all duration-500
                      ${dept.is_active 
                        ? (DarkMode ? 'bg-primBtn/10 text-primBtn' : 'bg-primBtn/5 text-primBtn') 
                        : (DarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300')}`}>
                      <Building2 size={24} />
                    </div>
                    <span className={`font-black text-[15px] capitalize tracking-tight ${dept.is_active ? (DarkMode ? "text-slate-200" : "text-slate-800") : (DarkMode ? "text-slate-600" : "text-slate-400")}`}>
                      {dept.name}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-7">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black capitalize border transition-all duration-500
                    ${dept.is_active ? (DarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100') : (DarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200')}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dept.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {dept.is_active ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-10 py-7 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEdit(dept)} className={`p-3 rounded-xl transition-all ${DarkMode ? 'bg-slate-800 text-slate-400 hover:text-primBtn' : 'bg-slate-50 text-slate-400 hover:text-primBtn'}`} title="Edit">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleToggleClick(dept)} className={`p-3 rounded-xl transition-all ${dept.is_active ? (DarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-400") : (DarkMode ? "bg-primBtn/20 text-primBtn" : "bg-primBtn/10 text-primBtn")}`} title={dept.is_active ? "Deactivate" : "Activate"}>
                      {dept.is_active ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
                    </button>
                    <button onClick={() => setConfirmDelete(dept)} className={`p-3 rounded-xl transition-all ${DarkMode ? 'bg-slate-800 text-slate-600 hover:text-rose-500' : 'bg-slate-50 text-slate-300 hover:text-rose-600'}`} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD LAYOUT */}
      <div className="md:hidden flex flex-col gap-5 px-2 pb-10">
        {filteredData.map((dept) => (
          <div key={dept.id || dept._id} className={`${cardBg} rounded-[2.5rem] p-7 shadow-xl border`}>
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${dept.is_active ? (DarkMode ? 'bg-primBtn/10 text-primBtn' : 'bg-primBtn/5 text-primBtn') : 'bg-slate-100 text-slate-400'}`}>
                    <Building2 size={20} />
                  </div>
                  <h4 className={`font-black text-lg capitalize tracking-tight ${dept.is_active ? (DarkMode ? 'text-slate-100' : 'text-slate-900') : 'text-slate-400'}`}>{dept.name}</h4>
                </div>
                <button onClick={() => setConfirmDelete(dept)} className="text-rose-400 p-2 hover:bg-rose-50 rounded-full transition-all"><Trash2 size={18}/></button>
             </div>
             <div className="flex gap-3">
                <button onClick={() => onEdit(dept)} className={`flex-[0.5] py-4 rounded-2xl text-[11px] font-black capitalize tracking-widest border transition-all ${DarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>Edit</button>
                <button onClick={() => handleToggleClick(dept)} className={`flex-1 py-4 rounded-2xl text-[11px] font-black capitalize tracking-widest transition-all shadow-lg active:scale-95 text-white ${dept.is_active ? 'bg-rose-500 shadow-rose-500/20' : 'bg-primBtn shadow-primBtn/20'}`}>
                  {dept.is_active ? 'Deactivate' : 'Activate'}
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentTable;