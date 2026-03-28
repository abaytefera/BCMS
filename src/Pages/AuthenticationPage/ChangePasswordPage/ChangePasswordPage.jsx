import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCcw, CheckCircle2, Loader2, Lock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import PasswordField from '../../../Component/AuthenticateComponent/ChangePasswordPageComponent/PasswordField';
import StrengthMeter from '../../../Component/AuthenticateComponent/ChangePasswordPageComponent/StrengthMeter';
import { logout } from '../../../Redux/auth';
import { useUpdateUserPasswordMutation } from '../../../Redux/userApi';

const ChangePasswordPage = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [strength, setStrength] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { DarkMode } = useSelector((state) => state.webState || {});

  const [updateUserPassword, { isLoading }] = useUpdateUserPasswordMutation();

  /* ================= PASSWORD STRENGTH ================= */
  useEffect(() => {
    let s = 0;
    if (newPass.length >= 8) s++;
    if (/[A-Z]/.test(newPass) && /[a-z]/.test(newPass)) s++;
    if (/[0-9]/.test(newPass) || /[^A-Za-z0-9]/.test(newPass)) s++;
    setStrength(newPass ? s : 0);
  }, [newPass]);

  /* ================= UPDATE PASSWORD ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast.error('Passwords do not match', {
        style: { 
          borderRadius: '12px', 
          background: DarkMode ? '#1e293b' : '#333', 
          color: '#fff', 
          fontSize: '13px' 
        }
      });
      return;
    }

    if (strength < 2) {
      toast.error('Password security is too weak', {
        style: { 
          borderRadius: '12px', 
          background: DarkMode ? '#1e293b' : '#333', 
          color: '#fff', 
          fontSize: '13px' 
        }
      });
      return;
    }

    const updatePromise = updateUserPassword({
      currentPassword: currentPass,
      newPassword: newPass,
    }).unwrap();

    toast.promise(
      updatePromise,
      {
        loading: 'Updating security credentials...',
        success: () => {
          setCurrentPass('');
          setNewPass('');
          setConfirmPass('');
          setStrength(0);
          return 'Password updated successfully!';
        },
        error: (err) => {
          if (err?.status === 401) {
            localStorage.removeItem('authToken');
            dispatch(logout());
            navigate('/login', { replace: true });
            return 'Session expired';
          }
          return err?.data?.message || 'Failed to update password.';
        },
      },
      {
        style: {
          minWidth: '280px',
          borderRadius: '15px',
          background: DarkMode ? '#0f172a' : '#1e293b',
          color: '#fff',
          fontSize: '13px',
          fontWeight: '600',
        },
        success: {
          duration: 5000,
          iconTheme: { primary: '#10b981', secondary: '#fff' },
        },
      }
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
      <Toaster position="top-center" reverseOrder={false} />

      <Sidebar role="all" url="/settings" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className={`flex-1 flex items-center justify-center pt-24 pb-12 px-6 transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
          <div className={`w-full max-w-lg mt-12 border px-10 py-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden transition-all duration-300 ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>

            {/* SaaS Background Decor */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[120px] rounded-full transition-colors ${DarkMode ? 'bg-primBtn/5' : 'bg-emerald-500/10'}`} />

            <div className="relative z-10">
              <div className="flex flex-col items-center text-center mb-12">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 border-2 transition-all ${DarkMode ? 'bg-slate-800 border-slate-700 text-primBtn' : 'bg-emerald-50 border-emerald-100 text-textColor'}`}>
                  {isLoading ? (
                    <Loader2 size={36} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={36} strokeWidth={1.5} />
                  )}
                </div>

                <h1 className={`text-4xl font-black tracking-tight capitalize ${DarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  Change <span className="text-primBtn">Password</span>
                </h1>

               
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <PasswordField
                  label="Current password"
                  value={currentPass}
                  onChange={setCurrentPass}
                  placeholder="••••••••"
                  disabled={isLoading}
                />

                <div className={`pt-8 border-t transition-colors ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <PasswordField
                    label="New secure password"
                    value={newPass}
                    onChange={setNewPass}
                    placeholder="Min. 8 characters"
                    disabled={isLoading}
                  />
                  <StrengthMeter strength={strength} />
                </div>

                <PasswordField
                  label="Confirm new password"
                  value={confirmPass}
                  onChange={setConfirmPass}
                  placeholder="Repeat new password"
                  disabled={isLoading}
                />

                <div className="flex flex-col gap-6 pt-4">
                  <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ${DarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-emerald-50 border-emerald-100'}`}>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className={`text-[11px] font-bold capitalize tracking-wide ${DarkMode ? 'text-slate-400' : 'text-emerald-700'}`}>
                      Two-factor authentication is active
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !currentPass || !newPass}
                    className={`w-full py-5 rounded-[2rem] text-white font-black text-sm capitalize tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-40 disabled:grayscale
                      ${DarkMode ? 'bg-primBtn shadow-primBtn/20' : 'bg-textColor shadow-textColor/20'}`}
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <RefreshCcw size={20} />
                    )}
                    {isLoading ? 'Processing changes...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePasswordPage;