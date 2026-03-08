import React, { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { ChangeLanguage } from "../../Redux/WebState";
import { Link } from "react-router-dom";
import { User } from "lucide-react"; 
import NotificationBell from "./Notification";

const AuthHeader = ({ True }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { Language } = useSelector((state) => state.webState);
  const { user } = useSelector((state) => state.auth);
  const [windowOffset, setWindowOffset] = useState(0);
  const Dispatch = useDispatch();

  useEffect(() => {
    const scrollHandle = () => {
      setWindowOffset(window.scrollY);
    };
    window.addEventListener("scroll", scrollHandle);
    return () => {
      window.removeEventListener("scroll", scrollHandle);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleLanguage = (e) => {
    const value = e.target.value;
    if (!value) return;
    Dispatch(ChangeLanguage(value));
  };

  const content = {
    LangLabel: Language === "AMH" ? "ቋንቋ ይቀይሩ" : "Language Change",
    Logout: Language === "AMH" ? "ውጣ" : "Logout",
  };

  return (
    <header
      className={`h-20 lg:pr-40 shadow bg-white transition-all ease-out duration-300 fixed w-full z-50`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${True ? "lg:px-8" : "lg:px-1"}`}>
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className={`flex-shrink-0 ${True ? "opacity-0" : "block"}`}>
            <Link to="/dashboard">
              <img
                src="https://res.cloudinary.com/dkzvlqjp9/image/upload/v1768827371/logo_xebgif.png"
                alt="Logo"
                className="w-40 h-auto"
              />
            </Link>
          </div>
          <div className="md:hidden">
           <NotificationBell></NotificationBell>
           </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-6">
            
          
 <NotificationBell></NotificationBell>
            {/* Officer Profile */}
            <div className={`flex ${True && "md:mr-20"} items-center space-x-3 p-1.5 pr-4 rounded-full border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer`}>
              <div className="w-10 h-10 rounded-full bg-primBtn border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                <User className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-tighter leading-none">{user?.role}</span>
                <span className="text-slate-900 text-sm font-bold leading-tight">{user?.username}</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-slate-700 hover:text-emerald-600 focus:outline-none"
            >
              {isOpen ? <HiX size={30} /> : <HiMenu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-2xl border-t p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primBtn flex items-center justify-center text-white">
                <User size={28} />
               
              </div>
              <div>
                <p className="text-slate-900 font-bold">{user?.username}</p>
                <p className="text-slate-500 text-xs">{user?.role}</p>
              </div>
            </div>

            <button className="bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors">
              {content.Logout}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthHeader;