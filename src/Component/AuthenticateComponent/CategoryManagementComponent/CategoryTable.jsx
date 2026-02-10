import React, { useState } from "react";
import {
  Edit3,
  CheckCircle2, 
  ShieldX,      
  Building2,
  Search,
  SlidersHorizontal,
  Timer,
  AlertCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";

const CategoryTable = ({ categories = [], onEdit, onToggle, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmToggle, setConfirmToggle] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredCategories = categories.filter((cat) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(searchLower) ||
      cat.Department?.name?.toLowerCase().includes(searchLower)
    );
  });

  const confirmAction = () => {
    if (confirmToggle) {
      onToggle(confirmToggle.id || confirmToggle._id);
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
    <div className="flex flex-col gap-6 w-full relative">
      
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
              <span className="block font-semibold text-slate-800 mt-1 italic">"{confirmToggle.name}"</span>
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
                className={`flex-1 py-4  rounded-2xl text-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all ${
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
            
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Delete Category?</h3>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
           Warning: Deleting this category will also delete all compliant data. This cannot be undone. Are you sure?
              <span className="block font-semibold text-rose-600 mt-1 italic">"{confirmDelete.name}"</span>
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search classification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/30">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-widest">
            <tr>
              <th className="px-8 py-6">Classification Name</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Settings</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filteredCategories.map((cat) => (
              <tr key={cat.id || cat._id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${cat.is_active ? 'text-slate-800' : 'text-slate-400'}`}>
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 tracking-tighter">
                      {cat.Department?.name || "General"}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-6">
                  {cat.is_active ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                      <CheckCircle2 size={14} className="animate-pulse" /> Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                      <ShieldX size={14} /> Inactive
                    </div>
                  )}
                </td>

                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 transition-opacity">
                    <button 
                      onClick={() => onEdit(cat)} 
                      className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => setConfirmToggle(cat)}
                      className={`p-2.5 rounded-xl transition-all ${
                        cat.is_active 
                        ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50" 
                        : "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                      title={cat.is_active ? "Deactivate" : "Activate"}
                    >
                      {cat.is_active ? <ShieldX size={18} /> : <CheckCircle2 size={18} />}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(cat)}
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

      {/* Mobile Card Layout */}
      <div className="md:hidden flex flex-col gap-4 px-2">
        {filteredCategories.map((cat) => (
          <div key={cat.id || cat._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h4 className={`font-bold text-base ${cat.is_active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>{cat.name}</h4>
                <div className="flex gap-2">
                   <button onClick={() => setConfirmDelete(cat)} className="text-rose-400 p-1"><Trash2 size={16}/></button>
                   {cat.is_active ? 
                    <CheckCircle2 size={16} className="text-emerald-500" /> : 
                    <ShieldX size={16} className="text-slate-300" />
                  }
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(cat)} className="flex-1 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-500">Edit</button>
                <button 
                  onClick={() => setConfirmToggle(cat)} 
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase ${cat.is_active ? 'bg-rose-50 text-rose-600' : 'bg-emerald-600 text-white'}`}
                >
                  {cat.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTable;