import React, { useEffect, useState } from 'react';
// Toast
import toast, { Toaster } from 'react-hot-toast';
import { 
  useGetDepartmentsQuery, 
  useAddDepartmentMutation, 
  useUpdateDepartmentMutation
} from '../../../Redux/departmentApi';

import { useNavigate } from 'react-router-dom'; // ✅ ADDED

import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import DepartmentForm from '../../../Component/AuthenticateComponent/DepartmentManagementComponent/DepartmentForm';
import DepartmentTable from '../../../Component/AuthenticateComponent/DepartmentManagementComponent/DepartmentTable';
import AuthFooter from '../../../Component/AuthenticateComponent/AuthFooter';

import { Loader2, ServerOff, Globe, Plus, X } from 'lucide-react';
import { useGetUsersQuery } from '../../../Redux/userApi';
import { useDispatch } from 'react-redux';
import { logout } from '../../../Redux/auth';
const DepartmentPage = () => {
  const [editingDept, setEditingDept] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate(); // ✅ ADDED

  // RTK Query Hooks
  const { 
    data: departmentsData, 
    isLoading, 
    isError,
    error: deptError // ✅ ADDED
  } = useGetDepartmentsQuery();

  const [addDepartment, { isLoading: isAdding }] =
    useAddDepartmentMutation();

  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();

  const { 
    data: user,
    error: userError // ✅ ADDED
  } = useGetUsersQuery();

 

  const departments = departmentsData || [];
const Dispath=useDispatch()
  // ✅ 401 REDIRECT HANDLER (ONLY ADDITION)
  useEffect(() => {
    const errors = [deptError, userError];

    const isUnauthorized = errors.some(
      (err) => err?.status === 401
    );

    if (isUnauthorized) {
      localStorage.removeItem('authToken');
                   Dispath(logout())
      navigate('/login', { replace: true });
    }
  }, [deptError, userError, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Save or update department
  const handleSave = async (formData) => {
    const toastId = toast.loading(
      editingDept ? "Updating department..." : "Adding department..."
    );

    try {
      if (editingDept) {
        await updateDepartment({ 
          id: editingDept._id || editingDept.id, 
          ...formData
        }).unwrap();

        toast.success("Department updated successfully!", { id: toastId });
      } else {
        await addDepartment(formData).unwrap();
        toast.success("Department added successfully!", { id: toastId });
      }

      setEditingDept(null);
      setShowForm(false);
    } catch (err) {
      // ✅ 401 REDIRECT (ONLY ADDITION)
      if (err?.status === 401) {
           localStorage.removeItem('authToken');
                     Dispath(logout())
        navigate('/login', { replace: true });
        return;
      }

      toast.error(
        err?.data?.message || "Failed to save department",
        { id: toastId }
      );
    }
  };

  // Toggle department active status
  const handleToggleStatus = async ({ id, is_active }) => {
    try {
      await updateDepartment({ id, is_active: !is_active }).unwrap();
      toast.success(`Department ${!is_active ? 'Activated' : 'Deactivated'}`);
    } catch (err) {
      // ✅ 401 REDIRECT (ONLY ADDITION)
      if (err?.status === 401) {
        localStorage.setItem('authToken', null);
        navigate('/login', { replace: true });
        return;
      }

      toast.error("Failed to update status");
    }
  };

  // Edit button
  const handleEdit = (dept) => {
    setEditingDept(dept);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
<div className={`relative ${ isLoading &&("space-y-20 max-sm:space-y-20  ")} max-sm:space-y-4 md:bottom-10`}>
  
            {/* REGISTER BUTTON */}
           
            <div className="flex justify-end">
                          <button
                            onClick={() => {
                             setEditingDept(null);
                               setShowForm(true);
                            }}
                            className="flex items-center  gap-2 px-6 py-3 bg-textColor text-white font-black rounded-full  transition"
                          >
                            <Plus size={16} />
                            Register Category
                          </button>
                        </div>

            {/* TABLE */}
            {isLoading ? (
              <div className="flex flex-col items-center relative bottom-10 py-20 bg-white rounded-3xl border">
                              <Loader2
                                className="animate-spin text-textColor mb-3"
                                size={40}
                              />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Loading Department...
                              </span>
                            </div>
            ) : (
              <DepartmentTable 
                data={departments} 
                onEdit={handleEdit} 
                onToggleStatus={handleToggleStatus}
              />
            )}
        
          </div>
            </div>
        </main>
      </div>

      {/* ================= MODAL FORM ================= */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 rounded-[3rem] p-6">
            <DepartmentForm
              editingDept={editingDept}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingDept(null);
                toast("Editing cancelled", { icon: 'ℹ️' });
              }}
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
