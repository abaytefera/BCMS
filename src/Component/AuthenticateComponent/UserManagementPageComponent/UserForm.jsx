import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserPlus, User, Lock, RefreshCw, Phone, Briefcase, Building2, UserCheck } from 'lucide-react';
import { useGetDepartmentsQuery } from '../../../Redux/departmentApi';
import { useGetActiveManagerQuery } from '../../../Redux/supervisorApi';

const UserForm = ({ editingUser, onCancel, onSave, isLoading }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  
  const initialState = {
    id: '', 
    username: '',
    password: '',
    full_name: '',
    phone_number: '', 
    role: '', 
    departmentId: '', 
  };

  const [formData, setFormData] = useState(initialState);
  const [selectedExecutive, setSelectedExecutive] = useState("");
  
  const { data: depfile } = useGetDepartmentsQuery();
  const { data: activeManager } = useGetActiveManagerQuery();

  const rolesWithHiddenDept = ['SECRETARY', 'ADMIN', 'MANAGER', 'SECURITY'];

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0; i < 10; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return retVal;
  };

  useEffect(() => {
    if (editingUser) {
      setFormData({
        id: editingUser.id || editingUser._id || '', 
        full_name: editingUser.full_name || '',
        phone_number: editingUser.phone_number || '',
        username: editingUser.username || '',
        role: editingUser.role ? editingUser.role.toUpperCase() : '',
        departmentId: editingUser.departmentId?._id || editingUser.departmentId || '',
        password: '' 
      });
      if (editingUser.assignedExecutive) {
        setSelectedExecutive(editingUser.assignedExecutive._id || editingUser.assignedExecutive);
      }
    } else {
      setFormData({ ...initialState, password: generatePassword() });
      setSelectedExecutive("");
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalData = { ...formData, role: formData.role.toUpperCase() };
    if (rolesWithHiddenDept.includes(finalData.role)) {
      delete finalData.departmentId;
    }
    if (finalData.role === 'SECRETARY') {
      finalData.assignedExecutive = Number(selectedExecutive);
    }
    if (editingUser) {
      delete finalData.password; 
    } else {
      delete finalData.id; 
    }
    onSave(finalData);
  };

  const inputClasses = `w-full transition-all duration-300 rounded-2xl pl-12 pr-5 py-4 text-sm outline-none border 
    ${DarkMode 
      ? "bg-slate-800/50 border-slate-700 text-slate-100 focus:border-primBtn focus:bg-slate-800" 
      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-primBtn focus:bg-white"}`;

  const labelClasses = `text-[11px] font-black capitalize tracking-wide mb-1.5 block ml-1
    ${DarkMode ? "text-slate-500" : "text-slate-400"}`;

  return (
    <div className={`p-2 transition-colors duration-300 ${DarkMode ? "bg-transparent" : "bg-transparent"}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Full Name */}
        <div className="group">
          <label className={labelClasses}>Full name</label>
          <div className="relative">
            <UserPlus className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${DarkMode ? "text-slate-600 group-focus-within:text-primBtn" : "text-slate-400 group-focus-within:text-primBtn"}`} size={18} />
            <input
              type="text"
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className={inputClasses}
              placeholder="Enter full name"
              required
            />
          </div>
        </div>

        {/* Username */}
        <div className="group">
          <label className={labelClasses}>Username</label>
          <div className="relative">
            <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${DarkMode ? "text-slate-600 group-focus-within:text-primBtn" : "text-slate-400 group-focus-within:text-primBtn"}`} size={18} />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className={inputClasses}
              placeholder="e.g. john_doe"
              required
            />
          </div>
        </div>

        {/* Password - New Users Only */}
        {!editingUser && (
          <div className="group">
            <label className={labelClasses}>Access password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
              <input
                type="text" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`w-full rounded-2xl pl-12 pr-12 py-4 text-sm font-mono border transition-all
                  ${DarkMode 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}
                required
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, password: generatePassword()})}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 hover:rotate-180 transition-transform duration-500"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Phone Number */}
        <div className="group">
          <label className={labelClasses}>Phone number</label>
          <div className="relative">
            <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${DarkMode ? "text-slate-600 group-focus-within:text-primBtn" : "text-slate-400 group-focus-within:text-primBtn"}`} size={18} />
            <input
              type="tel"
              value={formData.phone_number} 
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className={inputClasses}
              placeholder="+251 ..."
            />
          </div>
        </div>

        {/* Role & Dept Grid */}
        <div className={`grid ${!rolesWithHiddenDept.includes(formData.role) ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
          <div className="group">
            <label className={labelClasses}>System role</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`${inputClasses} appearance-none cursor-pointer`}
                required
              >
                <option value="" disabled>Select role</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="MANAGER">Manager</option>
                <option value="OFFICER">Officer</option>
                <option value="SECRETARY">Secretary</option>
                <option value="SECURITY">Security</option>
              </select>
            </div>
          </div>

          {!rolesWithHiddenDept.includes(formData.role) && (
            <div className="group animate-in fade-in slide-in-from-right-4 duration-500">
              <label className={labelClasses}>Department</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                  required={!rolesWithHiddenDept.includes(formData.role)}
                >
                  <option value="" disabled>Select dept</option>
                  {depfile?.map((dep) => (
                    <option key={dep.id || dep._id} value={dep.id || dep._id}>{dep.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Secretary Assignment */}
        {formData.role === "SECRETARY" && (
          <div className="group animate-in fade-in slide-in-from-top-4 duration-500">
            <label className={labelClasses}>Assign to executive manager</label>
            <div className="relative">
              <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={selectedExecutive}
                onChange={(e) => setSelectedExecutive(e.target.value)}
                className={`${inputClasses} appearance-none cursor-pointer`}
                required
              >
                <option value="">Select executive</option>
                {activeManager?.map((m) => (
                  <option key={m.id} value={m.id}>{m.full_name || m.username}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 py-4 rounded-2xl font-bold capitalize transition-all
              ${DarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] bg-primBtn hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-lg shadow-primBtn/25 capitalize tracking-wide transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : editingUser ? 'Update' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;