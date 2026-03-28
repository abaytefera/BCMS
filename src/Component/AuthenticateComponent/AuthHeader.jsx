import React, { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { ChangeLanguage, ToggleDarkMode } from "../../Redux/WebState";
import { Link } from "react-router-dom";
import { User, Sun, Moon, LogOut } from "lucide-react"; 
import NotificationBell from "./Notification";

const AuthHeader = ({ True }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { Language, DarkMode } = useSelector((state) => state.webState);
  const { user } = useSelector((state) => state.auth);
  const [windowOffset, setWindowOffset] = useState(0);
  const Dispatch = useDispatch();

  useEffect(() => {
    const scrollHandle = () => setWindowOffset(window.scrollY);
    window.addEventListener("scroll", scrollHandle);
    return () => window.removeEventListener("scroll", scrollHandle);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleToggleDarkMode = () => {
    Dispatch(ToggleDarkMode());
  };

  const content = {
    LangLabel: Language === "AMH" ? "ቋንቋ ይቀይሩ" : "Language change",
    Logout: Language === "AMH" ? "ውጣ" : "Logout",
  };

  return (
    <header
      className={`h-20 lg:pr-40 transition-all duration-300 fixed w-full z-50 border-b
      ${windowOffset > 10 ? "shadow-lg shadow-black/5" : ""}
      ${DarkMode 
        ? "bg-slate-900/80 backdrop-blur-md border-slate-800" 
        : "bg-white/80 backdrop-blur-md border-slate-100"}`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 h-full ${True ? "lg:px-8" : "lg:px-1"}`}>
        <div className="flex justify-between items-center h-full">

          {/* Logo Section */}
          <div className={`flex-shrink-0 transition-all duration-500 transform ${True ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"}`}>
            <Link to="/dashboard" className="block group">
              <img
                src="https://res.cloudinary.com/dkzvlqjp9/image/upload/v1768827371/logo_xebgif.png"
                alt="Logo"
                className={`w-36 h-auto transition-all group-hover:scale-105 ${DarkMode ? "brightness-125 saturate-150" : ""}`}
              />
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex relative right-5 items-center space-x-5">
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={handleToggleDarkMode}
              className={`p-2.5 rounded-2xl border transition-all duration-300 group
                ${DarkMode 
                  ? "bg-slate-800 border-slate-700 text-yellow-400 hover:border-primBtn/50" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-primBtn/30 shadow-sm"}`}
            >
              {DarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NotificationBell />

            {/* Profile Shell - Using --color-textColor for the role */}
            <div className={`flex ${True && "md:mr-20"} items-center gap-3 p-1.5 pr-5 rounded-[1.25rem] border transition-all 
              ${DarkMode 
                ? "border-slate-700 bg-slate-800/40 hover:bg-slate-800" 
                : "border-slate-100 bg-slate-50/80 hover:bg-white hover:shadow-md shadow-sm"}`}>
              
              <div className="relative">
                {/* Avatar uses --color-primBtn */}
                <div className="w-10 h-10 rounded-xl bg-primBtn flex items-center justify-center shadow-lg shadow-primBtn/20">
                  <User className="text-white" size={20} />
                </div>
        
              </div>

              <div className="flex flex-col">
                <span className={`text-[10px] font-black capitalize tracking-wider leading-none mb-1 text-textColor`}>
                  {user?.role}
                </span>
                <span className={`text-sm font-bold leading-none ${DarkMode ? "text-slate-100" : "text-slate-900"}`}>
                  {user?.username}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Actions Container */}
          <div className="md:hidden flex items-center gap-3">
             <button 
               onClick={handleToggleDarkMode} 
               className={`p-2 rounded-xl ${DarkMode ? "text-yellow-400 bg-slate-800" : "text-slate-600 bg-slate-100"}`}
             >
              {DarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <NotificationBell />
            <button 
              onClick={toggleMenu} 
              className={`p-1 transition-colors ${DarkMode ? "text-slate-100" : "text-slate-700"}`}
            >
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className={`md:hidden absolute w-full shadow-2xl border-t p-6 animate-in fade-in slide-in-from-top-4 duration-300 
          ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex flex-col space-y-6">
            <div className={`flex items-center space-x-4 p-4 rounded-2xl border ${DarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
              <div className="w-12 h-12 rounded-2xl bg-primBtn flex items-center justify-center text-white shadow-lg">
                <User size={24} />
              </div>
              <div>
                <p className={`font-black tracking-tight ${DarkMode ? "text-slate-100" : "text-slate-900"}`}>
                  {user?.username}
                </p>
                <p className={`text-xs font-bold capitalize text-textColor`}>
                  {user?.role}
                </p>
              </div>
            </div>

            <button className={`w-full py-4 rounded-2xl font-bold text-sm capitalize transition-all flex items-center justify-center space-x-3 
              ${DarkMode 
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" 
                : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
              <LogOut size={18} />
              <span>{content.Logout}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthHeader;