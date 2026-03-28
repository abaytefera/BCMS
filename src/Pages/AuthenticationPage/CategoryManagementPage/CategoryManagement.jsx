import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useOneUpdateMutation,
  useDeleteCategoryMutation,
} from '../../../Redux/categoryApi';
import { useGetDepartmentsQuery } from '../../../Redux/departmentApi';

import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import CategoryForm from '../../../Component/AuthenticateComponent/CategoryManagementComponent/CategoryForm';
import CategoryTable from '../../../Component/AuthenticateComponent/CategoryManagementComponent/CategoryTable';
import { logout } from '../../../Redux/auth';

import { Loader2, Plus, X, Layers } from 'lucide-react';

const CategoryManagement = () => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  const [editingCat, setEditingCat] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ===================== RTK QUERY ===================== */
  const {
    data: categories = [],
    isLoading,
    isError,
    error: cError,
  } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating, error: createError }] =
    useCreateCategoryMutation();

  const [OneUpdate, { isLoading: isUpdating, error: updateError }] =
    useOneUpdateMutation();

  const [deleteCategory] = useDeleteCategoryMutation();

  const { data: departments, error: dError } = useGetDepartmentsQuery();

  /* ===================== 401 REDIRECT ===================== */
  useEffect(() => {
    const errors = [cError, createError, updateError, dError];
    const isUnauthorized = errors.some((err) => err?.status === 401);

    if (isUnauthorized) {
      localStorage.removeItem('authToken');
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [cError, createError, updateError, dError, dispatch, navigate]);

  /* ===================== SAVE ===================== */
  const handleSave = async (payload) => {
    const toastId = toast.loading(
      editingCat ? 'Updating category...' : 'Creating category...'
    );

    try {
      if (editingCat) {
        await OneUpdate({
          id: editingCat.id || editingCat._id,
          ...payload,
        }).unwrap();
        toast.success('Category updated successfully', { id: toastId });
      } else {
        await createCategory(payload).unwrap();
        toast.success('Category registered successfully', { id: toastId });
      }
      setEditingCat(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save category', {
        id: toastId,
      });
    }
  };

  /* ===================== TOGGLE STATUS ===================== */
  const handleToggleStatus = async (category) => {
    const toastId = toast.loading('Updating status...');
    try {
      await OneUpdate({
        id: category.id || category._id,
        is_active: !category.is_active,
      }).unwrap();
      toast.success('Status updated', { id: toastId });
    } catch {
      toast.error('Status update failed', { id: toastId });
    }
  };

  /* ===================== DELETE CATEGORY ===================== */
  const handleDelete = async (id) => {
    const toastId = toast.loading('Deleting category...');
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully', { id: toastId });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete category', { id: toastId });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <Toaster position="top-right" />
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className={`flex-1 pt-24 px-6 lg:px-10 pb-20 transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            
            {/* SaaS PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${DarkMode ? 'bg-primBtn/20 text-primBtn' : 'bg-primBtn/10 text-primBtn'}`}>
                   <Layers size={28} />
                </div>
                <div>
                  <h1 className={`text-2xl font-black capitalize tracking-tight ${DarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Category <span className="text-textColor">management</span>
                  </h1>
                  <p className={`text-sm font-medium capitalize ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Organize and oversee your service categories
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingCat(null);
                  setShowForm(true);
                }}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primBtn text-white font-black rounded-2xl transition-all shadow-lg shadow-primBtn/25 active:scale-95 hover:brightness-110"
              >
                <Plus size={18} strokeWidth={3} />
                <span className="capitalize tracking-wide">Register category</span>
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="relative mt-4">
              {isLoading ? (
                <div className={`flex flex-col items-center py-32 rounded-[3rem] border border-dashed transition-all ${DarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Loader2 className="animate-spin text-primBtn mb-4" size={48} />
                  <span className={`text-xs font-black capitalize tracking-widest ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Loading categories...
                  </span>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <CategoryTable
                    categories={categories}
                    onEdit={(cat) => {
                      setEditingCat(cat);
                      setShowForm(true);
                    }}
                    onToggle={(id) => {
                      const category = categories.find(
                        (c) => (c.id || c._id) === id
                      );
                      if (category) handleToggleStatus(category);
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ===================== MODAL ===================== */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
         

            <div className="p-4">
              <CategoryForm
                editingCat={editingCat}
                departments={departments || []}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCat(null);
                }}
                isProcessing={isCreating || isUpdating}
              />
            </div>
          </div>
     
      )}
    </div>
  );
};

export default CategoryManagement;