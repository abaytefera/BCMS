import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Mail, Lock, Loader2, CheckCircle, AlertCircle, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../../Redux/auth'; 
import { ToggleDarkMode } from "../../Redux/WebState";

import LoginBg from '../../Component/CitizenComponent/LoginPageComponent/LoginBg';
import AuthInput from '../../Component/CitizenComponent/LoginPageComponent/AuthInput';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isloading, error: serverError } = useSelector((state) => state.auth);
  const { Language, DarkMode } = useSelector((state) => state.webState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState(""); // Local validation state

  const t = {
    title: Language === "AMH" ? "ግባ" : "Login",
    userLabel: Language === "AMH" ? "ኢሜይል ወይም መለያ ስም" : "Email / Username",
    passLabel: Language === "AMH" ? "የይለፍ ቃል" : "Password",
    loginBtn: Language === "AMH" ? "ግባ" : "Login",
    successMsg: Language === "AMH" ? "ተሳክቷል!" : "Success!",
    emptyFields: Language === "AMH" ? "እባክዎን ኢሜይል እና የይለፍ ቃል ያስገቡ" : "Please enter both email and password",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationError(""); // Reset local error

    // --- NEW VALIDATION CHECK ---
    if (!email.trim() || !password.trim()) {
      setValidationError(t.emptyFields);
      return;
    }

    const resultAction = await dispatch(LoginUser({ username: email, password }));

    if (LoginUser.fulfilled.match(resultAction)) {
      localStorage.setItem('authToken', resultAction.payload.token);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/Dashboard');
      }, 800);
    }
  };

  useEffect(() => {
    if (user) navigate('/Dashboard');
    window.scrollTo(0, 0);
  }, [user]);

  // Combine server errors and validation errors
  const displayError = validationError || serverError;

  return (
    <div className={`min-h-screen font-sans transition-all duration-700 ease-in-out ${DarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
      
      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={() => dispatch(ToggleDarkMode())}
          className={`group flex items-center gap-3 p-1.5 pr-4 rounded-full border-2 transition-all duration-300 active:scale-95 ${
            DarkMode 
              ? "bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-400/30" 
              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
          }`}
        >
          <div className={`p-2 rounded-full transition-all duration-500 ${DarkMode ? "bg-slate-800 rotate-[360deg]" : "bg-white shadow-sm"}`}>
            {DarkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </div>
          <span className={`text-[11px] font-bold capitalize tracking-tight ${DarkMode ? "text-slate-400" : "text-slate-500"}`}>
            {DarkMode ? "light mode" : "dark mode"}
          </span>
        </button>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in zoom-in duration-500 ${DarkMode ? "bg-slate-950/90 backdrop-blur-md" : "bg-white"}`}>
          <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl ${DarkMode ? "bg-emerald-500/10 shadow-emerald-500/5" : "bg-emerald-50"}`}>
               <CheckCircle size={56} className="text-emerald-500 animate-bounce" />
            </div>
            <h2 className="text-3xl font-black capitalize tracking-tight">{t.successMsg}</h2>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${DarkMode ? "opacity-5" : "opacity-25"}`}>
           <LoginBg />
        </div>

        <div className={`w-full max-w-md p-10 rounded-[3rem] border-2 transition-all duration-500 z-10 
          ${DarkMode 
            ? "bg-slate-900/40 border-slate-800 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl" 
            : "bg-white border-slate-100 shadow-[0_32px_100px_-20px_rgba(0,0,0,0.08)]"
          } 
          ${showSuccess ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}
        >
          <div className="flex flex-col items-center mb-10">
            <div className={`p-5 rounded-[2.5rem] mb-6 transition-all duration-500 ${DarkMode ? "bg-white shadow-[0_0_40px_rgba(255,255,255,0.1)]" : "bg-slate-50"}`}>
              <img src="/logo1.jpg" alt="Logo" className="w-28 h-auto" />
            </div>
            <h1 className="text-2xl font-black capitalize tracking-tight">Welcome back</h1>
            <p className={`text-sm mt-1 font-medium ${DarkMode ? "text-slate-500" : "text-slate-400"}`}>Please enter your details</p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            {/* Unified Error Message Display */}
            {displayError && (
              <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-4 ${
                DarkMode ? "bg-rose-500/5 border-rose-500/20 text-rose-400" : "bg-rose-50 border-rose-100 text-rose-600"
              }`}>
                <AlertCircle size={18} strokeWidth={2.5} />
                <p className="text-[12px] font-bold capitalize">{displayError.toLowerCase()}</p>
              </div>
            )}

            <div className="space-y-4">
              <AuthInput 
                icon={Mail} 
                type="text" 
                placeholder={t.userLabel} 
                value={email} 
                onChange={(e) => {
                    setEmail(e.target.value);
                    if(validationError) setValidationError(""); // Clear error when typing
                }} 
                className={DarkMode ? "bg-slate-800/50 border-slate-700 text-white" : ""}
              />
              
              <AuthInput 
                icon={Lock} 
                type="password" 
                placeholder={t.passLabel} 
                value={password} 
                onChange={(e) => {
                    setPassword(e.target.value);
                    if(validationError) setValidationError(""); // Clear error when typing
                }} 
                className={DarkMode ? "bg-slate-800/50 border-slate-700 text-white" : ""}
              />
            </div>

            <button
              type="submit"
              disabled={isloading || showSuccess}
              className={`group relative w-full mt-6 py-4.5 rounded-[1.25rem] bg-primBtn transition-all duration-300 active:scale-[0.97] disabled:opacity-50 shadow-2xl ${
                DarkMode ? "shadow-primBtn/20 hover:shadow-primBtn/40" : "shadow-blue-200 hover:shadow-blue-300"
              }`}
            >
              <div className="relative flex items-center justify-center gap-3">
                {isloading ? (
                  <Loader2 className="animate-spin text-white" size={22} />
                ) : (
                  <span className="text-[16px] font-black capitalize tracking-wide text-white">
                    {t.loginBtn}
                  </span>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;