import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';

const PasswordField = ({ label, value, onChange, placeholder, disabled }) => {
  const [show, setShow] = useState(false);
  const { DarkMode } = useSelector((state) => state.webState || {});

  // Dynamic Theme Styling
  const inputClasses = `
    w-full pl-14 pr-12 py-4 text-sm transition-all duration-300 outline-none border rounded-2xl
    ${DarkMode 
      ? "bg-slate-800/40 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:bg-slate-800 focus:border-primBtn focus:ring-4 focus:ring-primBtn/10" 
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-primBtn focus:ring-4 focus:ring-primBtn/5"
    }
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  const labelClasses = `
    text-[11px] font-black capitalize tracking-wider ml-1 mb-1.5 block
    ${DarkMode ? "text-slate-500" : "text-slate-400"}
  `;

  const iconClasses = `
    absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300
    ${DarkMode ? "text-slate-600 group-focus-within:text-primBtn" : "text-slate-400 group-focus-within:text-primBtn"}
  `;

  const actionButtonClasses = `
    absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-200
    ${DarkMode ? "text-slate-600 hover:text-slate-300" : "text-slate-400 hover:text-slate-700"}
  `;

  return (
    <div className="space-y-1 group">
      <label className={labelClasses}>
        {label}
      </label>

      <div className="relative group">
        {/* Leading Lock Icon */}
        <Lock
          size={19}
          strokeWidth={2.2}
          className={iconClasses}
        />

        <input
          type={show ? 'text' : 'password'}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />

        {/* Toggle Visibility Button */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className={actionButtonClasses}
          tabIndex="-1"
        >
          {show ? <EyeOff size={19} strokeWidth={2.2} /> : <Eye size={19} strokeWidth={2.2} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;