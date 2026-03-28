import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Edit3,
  CheckCircle2, 
  ShieldX,      
  Building2,
  Search,
  AlertTriangle,
  Trash2,
  X
} from "lucide-react";

const CategoryTable = ({ categories = [], onEdit, onToggle, onDelete }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
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

  // Theme Constants
  const cardBg = DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const tableHeaderBg = DarkMode ? 'bg-slate-900/50 text-slate-500' : 'bg-slate-50/50 text-slate-400';

  return (
    <div className="flex flex-col gap-8 w-full relative font-sans">
      
      {/* ================= MODAL: STATUS TOGGLE ================= */}
      {confirmToggle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${cardBg} rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border flex flex-col items-center text-center transform animate-in zoom-in-95 duration-300`}>
            <div className={`mb-6 p-5 rounded-[2rem] ${confirmToggle.is_active ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <AlertTriangle size={44} strokeWidth={1.5} />
            </div>
            
            <h3 className={`text-2xl font-black tracking-tight capitalize ${DarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Adjust status?</h3>
            <p className={`mt-3 text-sm leading-relaxed ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Confirm the {confirmToggle.is_active ? 'deactivation' : 'activation'} of 
              <span className="block font-bold text-primBtn mt-1 italic capitalize">"{confirmToggle.name}"</span>
            </p>

            <div className="flex gap-3 w-full mt-10">
              <button 
                onClick={() => setConfirmToggle(null)}
                className={`flex-1 py-4 rounded-2xl font-black text-[11px] capitalize tracking-wider transition-all ${DarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                Go back
              </button>
              <button 
                onClick={confirmAction}
                className={`flex-1 py-4 rounded-2xl text-white font-black text-[11px] capitalize tracking-wider shadow-xl active:scale-95 transition-all ${
                  confirmToggle.is_active ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-rose-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${cardBg} rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border-rose-500/20 flex flex-col items-center text-center transform animate-in zoom-in-95 duration-300 border`}>
            <div className="mb-6 p-5 rounded-[2rem] bg-rose-500/10 text-rose-500">
              <Trash2 size={44} strokeWidth={1.5} />
            </div>
            
            <h3 className={`text-2xl font-black tracking-tight capitalize ${DarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Delete category?</h3>
            <p className={`mt-3 text-sm leading-relaxed ${DarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Warning: this will remove all compliant data. This cannot be undone.
              <span className="block font-bold text-rose-500 mt-1 italic capitalize">"{confirmDelete.name}"</span>
            </p>

            <div className="flex gap-3 w-full mt-10">
              <button 
                onClick={() => setConfirmDelete(null)}
                className={`flex-1 py-4 rounded-2xl font-black text-[11px] capitalize tracking-wider transition-all ${DarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeletion}
                className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black text-[11px] capitalize tracking-wider shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR SECTION */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div className="relative w-full max-w-md group">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${DarkMode ? 'text-slate-600 group-focus-within:text-primBtn' : 'text-slate-400 group-focus-within:text-primBtn'}`} />
          <input
            type="text"
            placeholder="Search classification..."
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
        <table className="w-full text-left border-collapse">
          <thead className={`border-b text-[11px] font-black capitalize tracking-wider ${tableHeaderBg} ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <tr>
              <th className="px-10 py-6">Classification identity</th>
              <th className="px-10 py-6">Status</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${DarkMode ? 'divide-slate-800/50' : 'divide-slate-50'}`}>
            {filteredCategories.map((cat) => (
              <tr key={cat.id || cat._id} className={`group transition-all ${DarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'}`}>
                <td className="px-10 py-7">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${cat.is_active ? 'bg-primBtn/10 text-primBtn' : 'bg-slate-100 text-slate-400'}`}>
                       <Building2 size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-black text-[15px] capitalize tracking-tight transition-colors ${cat.is_active ? (DarkMode ? 'text-slate-100 group-hover:text-primBtn' : 'text-slate-800 group-hover:text-primBtn') : 'text-slate-500'}`}>
                        {cat.name}
                      </span>
                      <span className={`text-[11px] font-bold capitalize mt-0.5 ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                        {cat.Department?.name || "General"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-10 py-7">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black capitalize border transition-all duration-500
                    ${cat.is_active 
                      ? (DarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100') 
                      : (DarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200')}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {cat.is_active ? 'active' : 'inactive'}
                  </span>
                </td>

                <td className="px-10 py-7 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => onEdit(cat)} 
                      className={`p-3 rounded-xl transition-all ${DarkMode ? 'bg-slate-800 text-slate-400 hover:text-primBtn' : 'bg-slate-50 text-slate-400 hover:text-primBtn'}`}
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => setConfirmToggle(cat)}
                      className={`p-3 rounded-xl transition-all ${
                        cat.is_active 
                        ? (DarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-400") 
                        : (DarkMode ? "bg-primBtn/20 text-primBtn" : "bg-primBtn/10 text-primBtn")
                      }`}
                      title={cat.is_active ? "Deactivate" : "Activate"}
                    >
                      {cat.is_active ? <ShieldX size={18} /> : <CheckCircle2 size={18} />}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(cat)}
                      className={`p-3 rounded-xl transition-all ${DarkMode ? 'bg-slate-800 text-slate-600 hover:text-rose-500' : 'bg-slate-50 text-slate-300 hover:text-rose-600'}`}
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

      {/* MOBILE CARD LAYOUT */}
      <div className="md:hidden flex flex-col gap-5 px-2 pb-10">
        {filteredCategories.map((cat) => (
          <div key={cat.id || cat._id} className={`${cardBg} rounded-[2.5rem] p-7 shadow-xl border transition-all`}>
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${cat.is_active ? 'bg-primBtn/10 text-primBtn' : 'bg-slate-100 text-slate-400'}`}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className={`font-black text-lg capitalize tracking-tight ${cat.is_active ? (DarkMode ? 'text-slate-100' : 'text-slate-900') : 'text-slate-500'}`}>
                      {cat.name}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-400 capitalize">{cat.Department?.name || "General"}</p>
                  </div>
                </div>
                <button onClick={() => setConfirmDelete(cat)} className="text-rose-400 p-2 hover:bg-rose-50 rounded-full transition-all">
                  <Trash2 size={18}/>
                </button>
             </div>
             
             <div className="flex gap-3">
                <button 
                  onClick={() => onEdit(cat)} 
                  className={`flex-[0.5] py-4 rounded-2xl text-[11px] font-black capitalize tracking-widest border transition-all
                    ${DarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                >
                  Edit
                </button>
                <button 
                  onClick={() => setConfirmToggle(cat)} 
                  className={`flex-1 py-4 rounded-2xl text-[11px] font-black capitalize tracking-widest transition-all shadow-lg active:scale-95 text-white
                    ${cat.is_active ? 'bg-rose-500 shadow-rose-500/20' : 'bg-primBtn shadow-primBtn/20'}`}
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