import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} from '../../../Redux/userApi';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import UserForm from '../../../Component/AuthenticateComponent/UserManagementPageComponent/UserForm';
import UserTable from '../../../Component/AuthenticateComponent/UserManagementPageComponent/UserTable';
import { Loader2, Plus, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../Redux/auth';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const isAdmin = currentUser?.role === 'ADMIN';

  const [editingUser, setEditingUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  /* ===================== RTK QUERY ===================== */
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  /* ===================== 401 REDIRECT ===================== */
  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [error, dispatch, navigate]);

  /* ===================== FILTER CURRENT USER ===================== */
  const filteredUsers = Array.isArray(users)
    ? users.filter(u => u.id !== currentUser?.id && u._id !== currentUser?.id)
    : [];

  /* ===================== SAVE USER ===================== */
  const handleSave = async (payload) => {
    const toastId = toast.loading(editingUser ? 'Updating staff...' : 'Registering staff...');
    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id || editingUser._id, ...payload }).unwrap();
        toast.success('Staff updated successfully', { id: toastId });
      } else {
        await createUser(payload).unwrap();
        toast.success('Staff registered successfully', { id: toastId });
      }
      setEditingUser(null);
      setShowUserForm(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save staff', { id: toastId });
    }
  };

  /* ===================== DELETE USER ===================== */
  const handleDelete = async (id) => {
    const toastId = toast.loading('Deleting staff...');
    try {
      await deleteUser(id).unwrap();
      toast.success('Staff deleted successfully', { id: toastId });
    } catch {
      toast.error('Failed to delete staff', { id: toastId });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-slate-800">
      <Toaster position="top-right" />

      {/* ===================== SIDEBAR ===================== */}
      <Sidebar role={currentUser?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className="flex-1 pt-20 px-6 lg:px-10 pb-20 bg-slate-50/50">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">

            {/* HEADER */}
            <header className="text-left">
              <h1 className="text-2xl relative top-10 font-black capitalize">
                Staff <span className="text-textColor">Directory</span>
              </h1>
            </header>

            <div className={`relative ${(!isAdmin && isLoading )  && "top-15"} ${(!isAdmin )  && "top-10"} ${ isLoading &&("space-y-20 max-sm:space-y-20  ")} max-sm:space-y-4 md:bottom-10 `}>

              {/* REGISTER BUTTON */}
              {isAdmin && (
                <div className={`flex  justify-end`}>
                  <button
                    onClick={() => { setEditingUser(null); setShowUserForm(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-primBtn text-white font-black rounded-full hover:bg-primBtn transition"
                  >
                    <Plus size={16} /> Register Staff
                  </button>
                </div>
              )}

              {/* TABLE */}
              {isLoading ? (
                <div className="flex flex-col items-center relative bottom-10 py-20 bg-white rounded-3xl border">
                  <Loader2 className="animate-spin text-textColor mb-3" size={40} />
                  <span className="text-[10px] font-black capitalize tracking-widest text-slate-400">
                    Loading staff...
                  </span>
                </div>
              ) : (
                <UserTable
                  users={filteredUsers}
                  onEdit={(u) => { setEditingUser(u); setShowUserForm(true); }}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ===================== MODAL (UserForm like CategoryForm) ===================== */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-[3rem] p-4 shadow-2xl">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => { setShowUserForm(false); setEditingUser(null); }}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            {/* UserForm */}
            <div className="overflow-y-auto max-h-[80vh]">
              <UserForm
                editingUser={editingUser}
                onSave={handleSave}
                onCancel={() => { setShowUserForm(false); setEditingUser(null); }}
                isLoading={isCreating || isUpdating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;