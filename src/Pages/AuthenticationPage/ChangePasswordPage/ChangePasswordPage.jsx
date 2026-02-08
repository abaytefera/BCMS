import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCcw, CheckCircle2, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom'; // ✅ ADDED

import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import PasswordField from '../../../Component/AuthenticateComponent/ChangePasswordPageComponent/PasswordField';
import StrengthMeter from '../../../Component/AuthenticateComponent/ChangePasswordPageComponent/StrengthMeter';
import AuthFooter from '../../../Component/AuthenticateComponent/AuthFooter';
import { logout } from '../../../Redux/auth';
import { useUpdateUserPasswordMutation } from '../../../Redux/userApi';
import { useDispatch } from 'react-redux';

const ChangePasswordPage = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [strength, setStrength] = useState(0);
const Dispath=useDispatch()
  const navigate = useNavigate(); // ✅ ADDED

  const [updateUserPassword, { isLoading }] =
    useUpdateUserPasswordMutation();

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
        style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' }
      });
      return;
    }

    if (strength < 2) {
      toast.error('Password is too weak', {
        style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' }
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
          // ✅ ONLY ADDITION — 401 REDIRECT
          if (err?.status === 401) {
      localStorage.removeItem('authToken');
                 Dispath(logout())
            navigate('/login', { replace: true });
            return 'Session expired';
          }

          return err?.data?.message || 'Failed to update password.';
        },
      },
      {
        style: {
          minWidth: '250px',
          borderRadius: '15px',
          background: '#1e293b',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
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
    <div className="flex min-h-screen bg-white text-slate-800">
      <Toaster position="top-center" reverseOrder={false} />

      <Sidebar role="all" url="/settings" />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True />

        <main className="flex-1 flex items-center justify-center pt-20 px-6 bg-slate-50">
          <div className="w-full max-w-lg bg-white mt-20 min-h-[600px] border border-slate-200 px-10 py-12 rounded-[3rem] shadow-sm relative overflow-hidden">

            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-textColor mb-4 border border-emerald-100">
                  {isLoading ? (
                    <Loader2 size={32} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={32} />
                  )}
                </div>

                <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                  Security Update
                </h1>

                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                  Update your portal access credentials
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <PasswordField
                  label="Current Password"
                  value={currentPass}
                  onChange={setCurrentPass}
                  placeholder="••••••••"
                  disabled={isLoading}
                />

                <div className="pt-4 border-t border-slate-100">
                  <PasswordField
                    label="New Secure Password"
                    value={newPass}
                    onChange={setNewPass}
                    placeholder="Minimum 8 characters"
                    disabled={isLoading}
                  />
                  <StrengthMeter strength={strength} />
                </div>

                <PasswordField
                  label="Confirm New Password"
                  value={confirmPass}
                  onChange={setConfirmPass}
                  placeholder="Repeat new password"
                  disabled={isLoading}
                />

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                      Two-Factor Authentication is Active
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !currentPass || !newPass}
                    className="w-full bg-textColor disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <RefreshCcw size={20} />
                    )}

                    <span className="uppercase tracking-[0.2em] text-sm">
                      {isLoading ? 'Processing...' : 'Update Password'}
                    </span>
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
