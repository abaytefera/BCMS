import React from 'react';
import { useSelector } from 'react-redux';

const LoginBg = () => {
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden flex items-center justify-center transition-colors duration-700 ${
      DarkMode ? "bg-slate-950" : "bg-emerald-50"
    }`}>
      
      {/* Animated Blobs - SaaS standard soft glows */}
      <div className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse transition-all duration-700 ${
        DarkMode 
          ? "bg-primBtn/10 opacity-40" 
          : "bg-emerald-300/30 opacity-100"
      }`} />

      <div className={`absolute w-[400px] h-[400px] rounded-full blur-[80px] animate-bounce duration-[15s] -top-20 -left-20 transition-all duration-700 ${
        DarkMode 
          ? "bg-indigo-500/10 opacity-30" 
          : "bg-cyan-200/40 opacity-100"
      }`} />

      <div className={`absolute w-[350px] h-[350px] rounded-full blur-[90px] animate-pulse bottom-0 right-0 transition-all duration-700 ${
        DarkMode 
          ? "bg-emerald-500/10 opacity-20" 
          : "bg-green-200/20 opacity-100"
      }`} />
      
      {/* Texture Overlay - Subtle contrast pattern */}
      <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] transition-opacity duration-700 ${
        DarkMode ? "opacity-[0.03] invert" : "opacity-10"
      }`} />

      {/* Optional: Vignette effect for professional depth in Dark Mode */}
      {DarkMode && (
        <div className="absolute inset-0 bg-radial-gradient(circle, transparent 20%, rgba(2, 6, 23, 0.8) 100%)" />
      )}
    </div>
  );
};

export default LoginBg;