import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  useGetDepartmentsQuery, 
  useAddDepartmentMutation, 
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation 
} from '../../../Redux/departmentApi';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import DepartmentForm from '../../../Component/AuthenticateComponent/DepartmentManagementComponent/DepartmentForm';
import DepartmentTable from '../../../Component/AuthenticateComponent/DepartmentManagementComponent/DepartmentTable';
import { logout } from '../../../Redux/auth';
import { useGetUsersQuery } from '../../../Redux/userApi';
import { Loader2, Plus, Building2 } from 'lucide-react';

const DepartmentPage = () => {
  const [editingDept, setEditingDept] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Dark Mode Integration
  const { DarkMode } = useSelector((state) => state.webState || {});

  const { 
    data: departmentsData, 
    isLoading, 
    error: deptError 
  } = useGetDepartmentsQuery();

  const [addDepartment, { isLoading: isAdding }] = useAddDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const { data: user, error: userError } = useGetUsersQuery();
  const departments = departmentsData || [];

  useEffect(() => {
    const errors = [deptError, userError];
    const isUnauthorized = errors.some((err) => err?.status === 401);

    if (isUnauthorized) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [deptError, userError, navigate, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = async (formData) => {
    const toastId = toast.loading(editingDept ? "Updating department..." : "Adding department...");
    try {
      if (editingDept) {
        await updateDepartment({ id: editingDept._id || editingDept.id, ...formData }).unwrap();
        toast.success("Department updated successfully!", { id: toastId });
      } else {
        await addDepartment(formData).unwrap();
        toast.success("Department registered successfully!", { id: toastId });
      }
      setEditingDept(null);
      setShowForm(false);
    } catch (err) {
      if (err?.status === 401) {
        dispatch(logout());
        navigate('/login', { replace: true });
        return;
      }
      toast.error(err?.data?.message || "Failed to save department", { id: toastId });
    }
  };

  const handleToggleStatus = async ({ id, is_active }) => {
    const toastId = toast.loading('Synchronizing status...');
    try {
      await updateDepartment({ id, is_active: !is_active }).unwrap();
      toast.success(`Department ${!is_active ? 'activated' : 'deactivated'}`, { id: toastId });
    } catch (err) {
      toast.error("Status update failed", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this department?")) return;
    const toastId = toast.loading('Removing department...');
    try {
      await deleteDepartment(id).unwrap();
      toast.success('Department removed successfully', { id: toastId });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete', { id: toastId });
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setShowForm(true);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: DarkMode ? '#1e293b' : '#fff',
            color: DarkMode ? '#f1f5f9' : '#334155',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600'
          }
        }} 
      />
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className="flex-1 pt-28 px-6 lg:px-10 pb-20">
          <div className="max-w-6xl mx-auto">
            
            {/* Professional SaaS Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${DarkMode ? 'bg-primBtn/10 text-primBtn' : 'bg-primBtn/5 text-primBtn'}`}>
                    <Building2 size={18} />
                  </div>
                  <span className={`text-[11px] font-black capitalize tracking-widest ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Organization structure
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black capitalize tracking-tight">
                  Department <span className="text-primBtn">management</span>
                </h1>
              </div>

              <button
                onClick={() => { setEditingDept(null); setShowForm(true); }}
                className={`flex items-center gap-3 px-8 py-4 font-black rounded-2xl transition-all shadow-lg active:scale-95
                  ${DarkMode 
                    ? 'bg-primBtn text-white shadow-primBtn/20' 
                    : 'bg-textColor text-white shadow-emerald-200'}`}
              >
                <Plus size={20} strokeWidth={3} /> 
                <span className="capitalize text-sm tracking-wide">Register department</span>
              </button>
            </div>

            <div className="relative">
              {isLoading ? (
                <div className={`flex flex-col items-center py-32 rounded-[3rem] border-2 border-dashed transition-colors
                  ${DarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <Loader2 className="animate-spin text-primBtn mb-4" size={48} />
                  <span className={`text-xs font-black capitalize tracking-widest ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    Fetching organization data...
                  </span>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <DepartmentTable 
                    data={departments} 
                    onEdit={handleEdit} 
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modern SaaS Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => { setShowForm(false); setEditingDept(null); }}
          />
          <div className="relative w-full max-w-2xl transform animate-in zoom-in-95 duration-300">
            <DepartmentForm
              editingDept={editingDept}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingDept(null); }}
              user={user}
              isSaving={isAdding || isUpdating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;