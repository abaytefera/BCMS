import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

const DepartmentForm = ({
  editingDept,
  onSave,
  onCancel,
  user = [],
  isSaving
}) => {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl relative max-w-xl mx-auto"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-900 uppercase">
          {editingDept ? 'Update Department' : 'New Department'}
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} className="text-slate-400 hover:text-rose-500" />
        </button>
      </div>

      <div className="space-y-6">
        {/* DEPARTMENT NAME */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Department Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-semibold outline-none focus:border-emerald-500 focus:ring-emerald-500/10 transition-all"
            placeholder="e.g. Environmental Quality Control"
            required
          />
        </div>

        {/* SUPERVISOR SELECT */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Assigned Supervisor
          </label>

          <div className="relative">
            <select
              value={formData.supervisor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  supervisor: e.target.value
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-semibold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer pr-12"
              required
            >
              <option value="">Select a Supervisor</option>

              {Array.isArray(user) &&
                user
                  .filter(
                    (u) =>
                      u.role &&
                      u.role.toUpperCase() === 'SUPERVISOR'
                  )
                  .map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      {u.full_name || u.username}
                    </option>
                  ))}
            </select>

            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white transition-all transform active:scale-[0.98]
            bg-textColor shadow-lg shadow-emerald-200 
            ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {isSaving
            ? 'Processing...'
            : editingDept
            ? 'Save'
            : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
