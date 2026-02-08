import React, { useState } from 'react';
import { Edit3, Trash2, Mail, Search, AlertTriangle, Building2 } from 'lucide-react';

const UserTable = ({ users = [], onEdit, onDelete, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredBySearch = users.filter((u) => {
    const name = (u.fullName || u.full_name || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4 overflow-x-hidden">
      {/* SEARCH BAR */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Filter by name..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        {/* Scroll container only for table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10">
              <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                <th className="px-8 py-5">Staff Member</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5">Contact</th>
                {isAdmin && <th className="px-8 py-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBySearch.map((user) => (
                <tr key={user.id || user._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100/50 text-textColor flex items-center justify-center font-bold">
                        {(user.fullName || user.full_name || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-700">{user.fullName || user.full_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Building2 size={14} className="text-textColor" />
                      {user.department || user.Department?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail size={14} /> {user.email || user.username}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onEdit(user)}
                          className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        >
                          <Edit3 size={18}/>
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
          <div className="py-20 text-center text-slate-400 italic">No staff members found.</div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isAdmin && userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black mb-2">Are you sure?</h3>
            <p className="text-slate-500 text-sm mb-6">
              You are about to remove <span className="font-bold text-slate-900">{userToDelete.fullName}</span> from the system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(userToDelete.id || userToDelete._id); setUserToDelete(null); }}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-xs uppercase"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;