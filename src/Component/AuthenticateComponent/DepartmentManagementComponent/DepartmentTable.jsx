import React, { useState } from "react";
import { 
  Edit3, 
  Search, 
  Building2, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle,
  Trash2 
} from "lucide-react";

const DepartmentTable = ({ data = [], onEdit, onToggleStatus, onDelete }) => {
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

  return (
    <div className="flex flex-col gap-6 font-sans relative">
      
      {/* ================= MODAL: STATUS TOGGLE ================= */}
      {confirmToggle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center">
            <div className={`mb-6 p-5 rounded-3xl ${confirmToggle.is_active ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
              <AlertTriangle size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Change Status?</h3>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              Are you sure you want to {confirmToggle.is_active ? 'deactivate' : 'activate'} 
              <span className="block font-semibold text-slate-800 mt-1 italic uppercase">"{confirmToggle.name}"</span>
            </p>

            <div className="flex gap-3 w-full mt-8">
              <button 
                onClick={() => setConfirmToggle(null)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={confirmAction}
                className={`flex-1 py-4 rounded-2xl text-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all ${
                  confirmToggle.is_active ? 'bg-rose-500 shadow-slate-200' : 'bg-emerald-600 shadow-emerald-200'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-rose-900/20 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-rose-100 flex flex-col items-center text-center">
            <div className="mb-6 p-5 rounded-3xl bg-rose-50 text-rose-500">
              <Trash2 size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Delete Dept?</h3>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
            This action is permanent. Deleting this department will also delete all categories and compliant items under it. Are you sure you want to delete?
              <span className="block font-semibold text-rose-600 mt-1 italic uppercase">"{confirmDelete.name}"</span>
            </p>

            <div className="flex gap-3 w-full mt-8">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeletion}
                className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-rose-200 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div className="relative w-full max-w-md group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/30">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-widest">
            <tr>
              <th className="px-8 py-6">Department Identity</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((dept) => (
              <tr key={dept.id || dept._id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors ${dept.is_active ? 'bg-emerald-50 text-textColor' : 'bg-slate-100 text-slate-400'}`}>
                      <Building2 size={22} />
                    </div>
                    <span className={`font-bold text-sm capitalize tracking-tight ${dept.is_active ? "text-slate-800" : "text-slate-400"}`}>
                      {dept.name}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-6">
                  {dept.is_active ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                      <CheckCircle2 size={14} className="animate-pulse" /> Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                      <ShieldAlert size={14} /> Inactive
                    </div>
                  )}
                </td>

                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 transition-opacity">
                    <button 
                      onClick={() => onEdit(dept)} 
                      className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleClick(dept)}
                      className={`p-2.5 rounded-xl transition-all ${
                        dept.is_active 
                        ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50" 
                        : "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                      title={dept.is_active ? "Deactivate" : "Activate"}
                    >
                      {dept.is_active ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(dept)}
                      className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD LAYOUT ================= */}
      <div className="md:hidden flex flex-col gap-4 px-2">
        {filteredData.map((dept) => (
          <div key={dept.id || dept._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-md">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${dept.is_active ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                    <Building2 size={18} />
                  </div>
                  <h4 className={`font-bold text-base uppercase ${dept.is_active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>{dept.name}</h4>
                </div>
                <button onClick={() => setConfirmDelete(dept)} className="text-rose-400 p-1"><Trash2 size={16}/></button>
             </div>
             <div className="flex gap-3">
                <button onClick={() => onEdit(dept)} className="flex-1 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-500">Edit</button>
                <button 
                  onClick={() => handleToggleClick(dept)} 
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    dept.is_active ? 'bg-rose-50 text-rose-600' : 'bg-emerald-600 text-white'
                  }`}
                >
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