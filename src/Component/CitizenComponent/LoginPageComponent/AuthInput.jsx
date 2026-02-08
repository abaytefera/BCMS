import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = ({ icon: Icon, type, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Determine if this is a password field to show the toggle
  const isPasswordField = type === "password";

  return (
    <div className="relative w-full mb-4 group">
      {/* Left Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-textColor transition-colors">
        <Icon size={20} />
      </div>

      {/* Input Field */}
      <input
        type={isPasswordField && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white/60 border border-textColor py-4 pl-12 pr-12 rounded-2xl outline-none focus:border-textColor focus:ring-1 focus:ring-textColor transition-all placeholder:text-slate-400 text-slate-700"
      />

      {/* Password Toggle Button */}
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default AuthInput;