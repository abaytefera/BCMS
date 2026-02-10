import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  useGetDepartmentsQuery, 
  useAddDepartmentMutation, 
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation // ✅ Assuming this exists in your API
} from '../../../Redux/departmentApi';

import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import DepartmentForm from '../../../Component/AuthenticateComponent/DepartmentManagementComponent/DepartmentForm';
import DepartmentTable from '../../../Component/AuthenticateComponent/DepartmentManagementComponent/DepartmentTable';
import AuthFooter from '../../../Component/AuthenticateComponent/AuthFooter';

import { Loader2, Plus, X } from 'lucide-react';
import { useGetUsersQuery } from '../../../Redux/userApi';
import { useDispatch } from 'react-redux';
import { logout } from '../../../Redux/auth';

const DepartmentPage = () => {
  const [editingDept, setEditingDept] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const Dispath = useDispatch();

  const { 
    data: departmentsData, 
    isLoading, 
    error: deptError 
  } = useGetDepartmentsQuery();

  const [addDepartment, { isLoading: isAdding }] = useAddDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation(); // ✅ Hook initialized

  const { data: user, error: userError } = useGetUsersQuery();
  const departments = departmentsData || [];

  useEffect(() => {
    const errors = [deptError, userError];
    const isUnauthorized = errors.some((err) => err?.status === 401);

    if (isUnauthorized) {
      localStorage.removeItem('authToken');
      Dispath(logout());
      navigate('/login', { replace: true });
    }
  }, [deptError, userError, navigate, Dispath]);

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
        toast.success("Department added successfully!", { id: toastId });
      }
      setEditingDept(null);
      setShowForm(false);
    } catch (err) {
      if (err?.status === 401) {
        Dispath(logout());
        navigate('/login', { replace: true });
        return;
      }
      toast.error(err?.data?.message || "Failed to save department", { id: toastId });
    }
  };

  const handleToggleStatus = async ({ id, is_active }) => {
    const toastId = toast.loading('Updating status...');
    try {
      await updateDepartment({ id, is_active: !is_active }).unwrap();
      toast.success(`Department ${!is_active ? 'Activated' : 'Deactivated'}`, { id: toastId });
    } catch (err) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading('Deleting department...');
    try {
      await deleteDepartment(id).unwrap();
      toast.success('Department deleted successfully', { id: toastId });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete', { id: toastId });
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-700">
      <Toaster position="top-right" />
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        <main className="flex-1 pt-30 px-6 lg:px-10 pb-20">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl relative bottom-2 font-black capitalize">
              Department <span className="text-textColor">Management</span>
            </h1>

            <div className={`relative ${isLoading && "space-y-20"} md:bottom-10`}>
              <div className="flex justify-end">
                <button
                  onClick={() => { setEditingDept(null); setShowForm(true); }}
                  className="flex items-center gap-2 px-6 py-3 bg-textColor text-white font-black rounded-full transition hover:opacity-90"
                >
                  <Plus size={16} /> Register Department
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center py-20 bg-white rounded-3xl border">
                  <Loader2 className="animate-spin text-textColor mb-3" size={40} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading...</span>
                </div>
              ) : (
                <DepartmentTable 
                  data={departments} 
                  onEdit={handleEdit} 
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl">
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