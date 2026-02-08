import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Mail, Lock, Leaf, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../../Redux/auth'; 

import LoginBg from '../../Component/CitizenComponent/LoginPageComponent/LoginBg';
import AuthInput from '../../Component/CitizenComponent/LoginPageComponent/AuthInput';


const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user, isloading, error } = useSelector((state) => state.auth);
  const { Language } = useSelector((state) => state.webState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  
  // 1. Dispatch the action and capture the result
  const resultAction = await dispatch(LoginUser({ username: email, password }));

  // 2. LOG THE ERROR HERE
  if (LoginUser.rejected.match(resultAction)) {
    console.log("Login Failed Error:", resultAction.payload || resultAction.error);
  }

  if (LoginUser.fulfilled.match(resultAction)) {
    console.log("Login Success Data:", resultAction.payload);
    localStorage.setItem('authToken', resultAction.payload.token);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/Dashboard');
    }, 300);
  }
};

  useEffect(()=>{

    if(user){

      navigate('/Dashboard');
    }
  },[user])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = {
    title: Language === "AMH" ? "ግባ" : "Login ",
    userLabel: Language === "AMH" ? "ኢሜይል ወይም መለያ ስም" : "Email / Username",
    passLabel: Language === "AMH" ? "የይለፍ ቃል" : "Password",
    loginBtn: Language === "AMH" ? "ግባ" : "Login",
    forgotPass: Language === "AMH" ? "የይለፍ ቃል ረስተዋል?" : "Forgot Password?",
    successMsg: Language === "AMH" ? "ተሳክቷል!" : "Success!",
  };

  return (
    <div className="bg-white min-h-screen font-sans">

      
      {/* 300ms Clean White Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
               <CheckCircle size={48} className="text-emerald-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{t.successMsg}</h2>
          </div>
        </div>
      )}

      <div className="min-h-screen pt-24 flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
           <LoginBg />
        </div>

        <div className={`w-full max-w-md bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-10 flex flex-col items-center z-10 transition-all duration-300 ${showSuccess ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          
         <div className='flex flex-col'>
          <img src="/logo1.jpg" alt="" className='w-40 h-auto' />
          
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
           
          </p>

          <form onSubmit={handleLogin} className="w-full  h-80">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-rose-500 shrink-0" size={18} />
                <p className="text-rose-700 text-[11px] font-bold uppercase tracking-wide">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
                <AuthInput 
                  icon={Mail} 
                  type="text" 
                  placeholder={t.userLabel} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                
                <AuthInput 
                  icon={Lock} 
                  type="password" 
                  placeholder={t.passLabel} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
            </div>

          <button
  type="submit"
  disabled={isloading || showSuccess}
  className="group relative w-full mt-10 overflow-hidden rounded-2xl 
             bg-primBtn p-4 transition-all
             hover:brightness-110 active:scale-95
             disabled:opacity-50
             shadow-2xl shadow-[#73C2FB]/60"
>
  <div className="relative flex items-center justify-center gap-3">
    {isloading ? (
      <Loader2 className="animate-spin text-white" size={22} />
    ) : (
      <span className="text-sm font-extrabold uppercase tracking-[0.25em] text-white">
        {t.loginBtn}
      </span>
    )}
  </div>

  {/* Strong shine effect */}
  <div className="absolute inset-0 -translate-x-full 
                  bg-gradient-to-r 
                  from-transparent via-white/40 to-transparent 
                  transition-transform duration-500 group-hover:translate-x-full" />
</button>
           
          </form>

          
        </div>
      </div>
  
    </div>
  );
};

export default LoginPage;