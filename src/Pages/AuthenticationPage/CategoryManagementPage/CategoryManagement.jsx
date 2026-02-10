import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useOneUpdateMutation,
  useDeleteCategoryMutation, // Assuming this exists in your API slice
} from '../../../Redux/categoryApi';
import { useGetDepartmentsQuery } from '../../../Redux/departmentApi';

import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import CategoryForm from '../../../Component/AuthenticateComponent/CategoryManagementComponent/CategoryForm';
import CategoryTable from '../../../Component/AuthenticateComponent/CategoryManagementComponent/CategoryTable';
import AuthFooter from '../../../Component/AuthenticateComponent/AuthFooter';

import { Loader2, Plus, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../Redux/auth';

const CategoryManagement = () => {
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
    <div className="flex min-h-screen bg-white text-slate-800">
      <Toaster position="top-right" />
      <Sidebar role="supervisor" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className="flex-1 pt-20 px-6 lg:px-10 pb-20 bg-slate-50/50">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            {/* HEADER */}
            <header className="text-left">
              <h1 className="text-2xl relative top-10 font-black capitalize">
                Category <span className="text-textColor">Management</span>
              </h1>
            </header>
            <div className={`relative ${ isLoading &&("space-y-20 max-sm:space-y-20  ")} max-sm:space-y-4 md:bottom-10`}>

            {/* REGISTER BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingCat(null);
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
                  Loading Categories...
                </span>
              </div>
            ) : (
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
            )}
          </div>
          </div>
        </main>
      </div>

      {/* ===================== MODAL ===================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 rounded-[3rem] p-4">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCat(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

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