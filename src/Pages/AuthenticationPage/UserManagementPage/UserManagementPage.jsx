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
import { Loader2, Plus, X, Users2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../Redux/auth';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { DarkMode } = useSelector((state) => state.webState || {});
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

  const filteredUsers = Array.isArray(users)
    ? users.filter(u => u.id !== currentUser?.id && u._id !== currentUser?.id)
    : [];

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
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"}`}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            borderRadius: '1.5rem',
            background: DarkMode ? '#1e293b' : '#fff',
            color: DarkMode ? '#fff' : '#333',
            border: DarkMode ? '1px solid #334155' : '1px solid #f1f5f9'
          }
        }} 
      />

      <Sidebar role={currentUser?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className={`flex-1 pt-24 px-6 lg:px-10 pb-20 transition-colors duration-300 ${DarkMode ? "bg-slate-950" : "bg-slate-50/50"}`}>
          <div className="max-w-6xl mx-auto">
            
            {/* SaaS HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <header className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${DarkMode ? "bg-primBtn/10 text-primBtn" : "bg-primBtn/5 text-primBtn"}`}>
                    <Users2 size={24} />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight capitalize">
                    Staff <span className="text-textColor">directory</span>
                  </h1>
                </div>
                <p className={`text-sm font-medium capitalize ${DarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Manage organization members, roles, and access permissions
                </p>
              </header>

              {isAdmin && (
                <button
                  onClick={() => { setEditingUser(null); setShowUserForm(true); }}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-primBtn text-white font-black rounded-2xl hover:opacity-90 shadow-xl shadow-primBtn/20 transition-all active:scale-95 capitalize"
                >
                  <Plus size={20} strokeWidth={3} /> Register staff
                </button>
              )}
            </div>

            {/* CONTENT AREA */}
            <div className="relative">
              {isLoading ? (
                <div className={`flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed transition-all
                  ${DarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}>
                  <Loader2 className="animate-spin text-primBtn mb-4" size={48} />
                  <span className={`text-sm font-black capitalize tracking-widest ${DarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Loading staff data...
                  </span>
                </div>
              ) : (
                <div className={`rounded-[2.5rem] overflow-hidden border transition-all
                  ${DarkMode ? "bg-slate-900 border-slate-800 shadow-2xl shadow-black/50" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"}`}>
                  <UserTable
                    users={filteredUsers}
                    onEdit={(u) => { setEditingUser(u); setShowUserForm(true); }}
                    onDelete={handleDelete}
                    isAdmin={isAdmin}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ===================== SaaS MODAL ===================== */}
      {showUserForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => { setShowUserForm(false); setEditingUser(null); }}
          />
          
          <div className={`relative w-full max-w-2xl transform animate-in zoom-in-95 duration-300 rounded-[3rem] p-2 shadow-2xl
            ${DarkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-100"}`}>
            
            {/* Header / Close */}
            <div className="absolute top-8 right-8 z-10">
              <button
                onClick={() => { setShowUserForm(false); setEditingUser(null); }}
                className={`p-2.5 rounded-2xl transition-all hover:rotate-90 
                  ${DarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[85vh] custom-scrollbar px-6 py-8">
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