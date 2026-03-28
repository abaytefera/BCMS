import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Edit3, Trash2, Mail, Search, AlertTriangle, Building2, User } from 'lucide-react';

const UserTable = ({ users = [], onEdit, onDelete, isAdmin }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredBySearch = users.filter((u) => {
    const name = (u.fullName || u.full_name || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  // Base classes for consistent SaaS feel
  const cardBg = DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const textColorMain = DarkMode ? "text-slate-100" : "text-slate-700";
  const textColorMuted = DarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-6">
      {/* Search Bar - Professional Focus */}
      <div className="relative max-w-sm group">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${DarkMode ? "text-slate-600 group-focus-within:text-primBtn" : "text-slate-400 group-focus-within:text-primBtn"}`} size={18} />
        <input
          type="text"
          placeholder="Filter staff by name..."
          className={`w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all border
            ${DarkMode 
              ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-primBtn focus:ring-4 focus:ring-primBtn/10" 
              : "bg-white border-slate-200 text-slate-800 focus:border-primBtn focus:ring-4 focus:ring-primBtn/5"}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Wrapper */}
      <div className={`border rounded-[2rem] shadow-sm overflow-hidden transition-colors duration-300 ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors ${DarkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50/50 border-slate-100"}`}>
                <th className={`px-8 py-5 text-[11px] font-black capitalize tracking-wider ${textColorMuted}`}>Staff member</th>
                <th className={`px-8 py-5 text-[11px] font-black capitalize tracking-wider ${textColorMuted}`}>Department</th>
                <th className={`px-8 py-5 text-[11px] font-black capitalize tracking-wider ${textColorMuted}`}>Contact details</th>
                {isAdmin && <th className={`px-8 py-5 text-[11px] font-black capitalize tracking-wider text-right ${textColorMuted}`}>Actions</th>}
              </tr>
            </thead>
            <tbody className={`divide-y ${DarkMode ? "divide-slate-800" : "divide-slate-50"}`}>
              {filteredBySearch.map((user) => (
                <tr key={user.id || user._id} className={`group transition-colors ${DarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50/50"}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm
                        ${DarkMode ? "bg-slate-800 text-textColor" : "bg-slate-100 text-textColor"}`}>
                        {(user.fullName || user.full_name || "U").charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-bold capitalize ${textColorMain}`}>{user.fullName || user.full_name}</span>
                        <span className={`text-[10px] font-bold capitalize px-2 py-0.5 rounded-md w-fit mt-1
                          ${DarkMode ? "bg-primBtn/10 text-primBtn" : "bg-primBtn/5 text-primBtn"}`}>
                          {user.role?.toLowerCase() || 'staff'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-2 text-xs font-bold capitalize ${textColorMuted}`}>
                      <Building2 size={14} className="text-textColor" />
                      {user.department || user.Department?.name || "Unassigned"}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex flex-col gap-1 text-xs font-medium ${textColorMuted}`}>
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="opacity-70" /> {user.email || user.username}
                      </div>
                      {user.phone_number && <div className="pl-5 opacity-70">{user.phone_number}</div>}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(user)}
                          className={`p-2.5 rounded-xl transition-all border
                            ${DarkMode 
                              ? "text-slate-400 border-transparent hover:border-primBtn hover:text-primBtn hover:bg-primBtn/10" 
                              : "text-slate-400 border-transparent hover:border-primBtn/30 hover:text-primBtn hover:bg-slate-50"}`}
                        >
                          <Edit3 size={18}/>
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className={`p-2.5 rounded-xl transition-all border
                            ${DarkMode 
                              ? "text-slate-400 border-transparent hover:border-rose-500 hover:text-rose-500 hover:bg-rose-500/10" 
                              : "text-slate-400 border-transparent hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50"}`}
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBySearch.length === 0 && (
          <div className={`py-24 text-center ${textColorMuted} italic text-sm capitalize`}>
            No staff members match your search criteria.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - SaaS Style */}
      {isAdmin && userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" />
          <div className={`relative p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl transform animate-in zoom-in-95 duration-300 border
            ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className={`text-2xl font-black mb-3 capitalize ${DarkMode ? "text-white" : "text-slate-900"}`}>Confirm removal</h3>
            <p className={`text-sm mb-8 leading-relaxed ${textColorMuted}`}>
              Are you sure you want to remove <span className={`font-bold ${DarkMode ? "text-slate-200" : "text-slate-900"}`}>{userToDelete.fullName || userToDelete.full_name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setUserToDelete(null)}
                className={`flex-1 py-4 rounded-2xl font-bold text-xs capitalize transition-all
                  ${DarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                Go back
              </button>
              <button
                onClick={() => { onDelete(userToDelete.id || userToDelete._id); setUserToDelete(null); }}
                className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs capitalize transition-all active:scale-95 shadow-lg shadow-rose-500/25"
              >
                Remove staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;