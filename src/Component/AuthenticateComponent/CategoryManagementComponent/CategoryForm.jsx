import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Layers, Building2, Save, X, Timer, AlertCircle, Check } from 'lucide-react';

const CategoryForm = ({ editingCat, departments, onSave, onCancel, isProcessing }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  
  const initialState = {
    name: '',
    departmentId: '', 
    resolutionTimeDays: '', 
    escalationTimeDays: '', 
    is_active: true, 
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingCat) {
      setFormData({
        ...editingCat,
        departmentId: editingCat.departmentId || '',
        resolutionTimeDays: editingCat.resolutionTimeDays || '',
        escalationTimeDays: editingCat.escalationTimeDays || '',
        is_active: editingCat.is_active ?? true
      });
    } else {
      setFormData(initialState);
    }
  }, [editingCat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.departmentId || !formData.resolutionTimeDays) {
      return; 
    }

    try {
      const payload = {
        ...formData,
        departmentId: Number(formData.departmentId),
        resolutionTimeDays: Number(formData.resolutionTimeDays),
        escalationTimeDays: Number(formData.escalationTimeDays || 0)
      };

      await onSave(payload);

      if (!editingCat) {
        setFormData(initialState);
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  // Theme Constants
  const inputBase = `w-full border rounded-2xl px-5 py-4 text-sm outline-none transition-all duration-300 ${
    DarkMode 
      ? 'bg-slate-800/50 border-slate-700 text-slate-100 focus:border-primBtn/50 focus:ring-4 focus:ring-primBtn/5' 
      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-primBtn/30 focus:ring-4 focus:ring-primBtn/5'
  }`;

  const labelBase = `text-[11px] font-black tracking-wider ml-1 capitalize ${
    DarkMode ? 'text-slate-500' : 'text-slate-400'
  }`;

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`p-8 rounded-[2.5rem] border transition-all duration-300 ${
        DarkMode 
          ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40' 
          : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/60'
      }`}
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${DarkMode ? 'bg-primBtn/20 text-primBtn' : 'bg-primBtn/10 text-primBtn'}`}>
            <Layers size={20} />
          </div>
          <h2 className={`text-xl font-black capitalize tracking-tight ${DarkMode ? 'text-primBtn' : 'text-primBtn'}`}>
            {editingCat ? 'Update category' : 'Register category'}
          </h2>
        </div>

        <button 
          type="button"
          onClick={onCancel}
          className={`p-2 rounded-xl transition-colors ${DarkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Category Name */}
        <div className="space-y-2">
          <label className={labelBase}>Category title</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={inputBase} 
            placeholder="e.g. Network connectivity issues"
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className={labelBase}>Assigned department</label>
          <div className="relative">
            <Building2 className={`absolute left-5 top-1/2 -translate-y-1/2 ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`} size={18} />
            <select 
              value={formData.departmentId}
              onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
              className={`${inputBase} pl-14 appearance-none cursor-pointer`}
            >
              <option value="">Select department</option>
              {departments?.map((dept) => (
                <option key={dept.id || dept._id} value={dept.id || dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resolution & Escalation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={labelBase}>Resolution (days)</label>
            <div className="relative">
              <Timer className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
              <input 
                type="number"
                placeholder="0"
                value={formData.resolutionTimeDays}
                onChange={(e) => setFormData({...formData, resolutionTimeDays: e.target.value})}
                className={`${inputBase} pl-12`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelBase}>Escalation (days)</label>
            <div className="relative">
              <AlertCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
              <input 
                type="number"
                placeholder="0"
                value={formData.escalationTimeDays}
                onChange={(e) => setFormData({...formData, escalationTimeDays: e.target.value})}
                className={`${inputBase} pl-12`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-8">
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 py-4 rounded-2xl font-black text-[13px] capitalize transition-all ${
              DarkMode 
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
          Cancel
          </button>

          <button 
            type="submit"
            disabled={isProcessing}
            className="flex-[1.5] py-4 rounded-2xl bg-primBtn text-white font-black text-[13px] capitalize flex items-center justify-center gap-2 shadow-xl shadow-primBtn/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <Timer className="animate-spin" size={18} />
            ) : (
              <Check size={18} strokeWidth={3} />
            )}
            {editingCat ? 'Update category' : ' registration'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;