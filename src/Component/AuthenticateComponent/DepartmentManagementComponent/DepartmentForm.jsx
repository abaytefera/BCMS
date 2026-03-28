import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Building2, UserCheck, Send } from 'lucide-react';
import { useSelector } from 'react-redux';

const DepartmentForm = ({
  editingDept,
  onSave,
  onCancel,
  user = [],
  isSaving
}) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  
  const [formData, setFormData] = useState({
    name: '',
    supervisor: '',
    status: true
  });

  // Populate form when editing
  useEffect(() => {
    if (editingDept) {
      setFormData({
        name: editingDept.name || '',
        supervisor: editingDept.supervisor
          ? String(editingDept.supervisor)
          : '',
        status: editingDept.status ?? true
      });
    } else {
      setFormData({
        name: '',
        supervisor: '',
        status: true
      });
    }
  }, [editingDept]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);

    if (!editingDept) {
      setFormData({
        name: '',
        supervisor: '',
        status: true
      });
    }
  };

  // Theme Constants
  const cardBg = DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const labelText = DarkMode ? 'text-slate-500' : 'text-slate-400';
  const inputBg = DarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-xl mx-auto p-10 border rounded-[3rem] shadow-2xl transition-all duration-300 ${cardBg}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${DarkMode ? 'bg-primBtn/10 text-primBtn' : 'bg-primBtn/5 text-primBtn'}`}>
            <Building2 size={22} />
          </div>
          <h2 className={`text-2xl font-black capitalize tracking-tight ${DarkMode ? 'text-primBtn' : 'text-primBtn'}`}>
            {editingDept ? 'Update department' : 'New department'}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className={`p-2 rounded-full transition-all ${DarkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
        >
          <X size={20} className="hover:text-rose-500 transition-colors" />
        </button>
      </div>

      <div className="space-y-8">
        {/* DEPARTMENT NAME */}
        <div className="space-y-2.5">
          <label className={`text-[11px] font-black capitalize tracking-wider ml-1 ${labelText}`}>
            Department name
          </label>
          <div className="relative group">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full border rounded-2xl p-4 pl-5 text-sm font-semibold outline-none transition-all duration-300 
                ${inputBg} focus:border-primBtn focus:ring-4 focus:ring-primBtn/5`}
              placeholder="e.g. Environmental quality control"
              required
            />
          </div>
        </div>

        {/* SUPERVISOR SELECT */}
        <div className="space-y-2.5 relative">
          <label className={`text-[11px] font-black capitalize tracking-wider ml-1 ${labelText}`}>
            Assigned supervisor
          </label>

          <div className="relative group">
            <select
              value={formData.supervisor}
              onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
              className={`w-full border rounded-2xl p-4 pl-5 text-sm font-semibold outline-none transition-all duration-300 appearance-none cursor-pointer pr-12
                ${inputBg} focus:border-primBtn focus:ring-4 focus:ring-primBtn/5`}
              required
            >
              <option value="" className={DarkMode ? 'bg-slate-900' : 'bg-white'}>Select a supervisor</option>

              {Array.isArray(user) &&
                user
                  .filter((u) => u.role && u.role.toLowerCase() === 'supervisor')
                  .map((u) => (
                    <option 
                      key={u.id} 
                      value={String(u.id)}
                      className={DarkMode ? 'bg-slate-900' : 'bg-white'}
                    >
                      {u.full_name || u.username}
                    </option>
                  ))}
            </select>

            <ChevronDown
              className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primBtn ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}
              size={18}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-5 rounded-[2rem] font-black capitalize tracking-widest text-sm text-white transition-all transform active:scale-[0.97] flex items-center justify-center gap-3
              ${DarkMode ? 'bg-primBtn shadow-xl shadow-primBtn/20' : 'bg-textColor shadow-xl shadow-emerald-100'}
              ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
            `}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>
               
                {editingDept ? 'Update' : 'Register '}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DepartmentForm;