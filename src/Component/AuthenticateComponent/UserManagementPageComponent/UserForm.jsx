import React, { useEffect, useState } from 'react';
import { UserPlus, User, Lock, Save, RefreshCw, Phone } from 'lucide-react';
import { useGetDepartmentsQuery } from '../../../Redux/departmentApi';

const UserForm = ({ editingUser, onCancel, onSave, isLoading }) => {
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
  const { data: depfile } = useGetDepartmentsQuery();

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
    } else {
      setFormData({ ...initialState, password: generatePassword() });
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalData = { 
      ...formData, 
      role: formData.role.toUpperCase() 
    };
    
    if (editingUser) {
      delete finalData.password; 
    } else {
      delete finalData.id; 
    }
    
    onSave(finalData);
  };

  return (
    <div className="p-8 rounded-[2rem] max-w-2xl mx-auto font-sans">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* FULL NAME */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative">
            <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm focus:bg-white outline-none transition-all"
              placeholder="Full Name"
              required
            />
          </div>
        </div>

        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold bg-white text-slate-700 outline-none"
              placeholder="Username"
              required
            />
          </div>
        </div>

        {/* PASSWORD */}
        {!editingUser && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Generated Password
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pl-14 pr-12 py-4 text-sm font-mono text-emerald-700 outline-none"
                placeholder="Password"
                required
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, password: generatePassword()})}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 hover:rotate-180 transition-transform duration-500"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        )}

        {/* PHONE NUMBER */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="tel"
              value={formData.phone_number} 
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm focus:bg-white outline-none transition-all"
              placeholder="Phone Number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white transition-all"
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERVISOR">SUPERVISOR</option> {/* Added Option */}
              <option value="MANAGER">MANAGER</option>
              <option value="OFFICER">OFFICER</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:bg-white transition-all"
              required
            >
              <option value="" disabled>Select Dept</option>
              {depfile?.map((dep) => (
                <option key={dep.id || dep._id} value={dep.id || dep._id}>{dep.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primBtn  text-white font-black py-5 rounded-2xl shadow-lg uppercase tracking-widest text-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {editingUser ? 'Update Staff Member' : 'Register & Finalize'}
        </button>
      </form>
    </div>
  );
};
    
export default UserForm;