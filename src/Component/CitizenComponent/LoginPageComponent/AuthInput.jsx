import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';

const AuthInput = ({ icon: Icon, type, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { DarkMode } = useSelector((state) => state.webState);
  
  // Determine if this is a password field to show the toggle
  const isPasswordField = type === "password";

  return (
    <div className="relative w-full group">
      {/* Left Icon - Changes color based on theme and focus */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${
        DarkMode 
          ? "text-slate-600 group-focus-within:text-primBtn" 
          : "text-slate-400 group-focus-within:text-primBtn"
      }`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>

      {/* Input Field */}
      <input
        type={isPasswordField && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full py-4.5 pl-12 pr-12 rounded-[1.25rem] border-2 outline-none transition-all duration-300 font-medium text-[15px]
          ${DarkMode 
            ? "bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-primBtn/50 focus:ring-4 focus:ring-primBtn/10" 
            : "bg-white border-slate-100 text-slate-700 placeholder:text-slate-400 focus:border-primBtn focus:ring-4 focus:ring-primBtn/5 shadow-sm"
          }
        `}
      />

      {/* Password Toggle Button */}
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors p-2 rounded-xl ${
            DarkMode 
              ? "text-slate-600 hover:text-slate-300 hover:bg-slate-800" 
              : "text-slate-400 hover:text-primBtn hover:bg-slate-50"
          }`}
        >
          {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
        </button>
      )}
    </div>
  );
};

export default AuthInput;