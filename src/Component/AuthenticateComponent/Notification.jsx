import { useState, useRef, useEffect } from "react";
import { Bell, Info, AlertTriangle, BellOff, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);

  const { DarkMode } = useSelector((state) => state.webState);

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/notifications`, {
        headers: getAuthHeader(),
      });
      return response.data.filter((item) => item.id !== null);
    },
    refetchInterval: 300,
    enabled: !!localStorage.getItem("authToken"),
  });

  const markAsReadMutation = useMutation({
    mutationFn: async ({ id }) => {
      return await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
        headers: getAuthHeader(),
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["notifications"]);
      navigate(`/DetailList/${variables.complaintId}`);
      setOpen(false);
    },
  });

  const unreadCount = notifications.filter((n) => n.isRead === false).length;

  const handleNotificationClick = (item) => {
    if (!item.id || !item.complaintId) return;
    markAsReadMutation.mutate({ id: item.id, complaintId: item.complaintId });
  };

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-xl transition-all duration-300 outline-none group active:scale-95
          ${DarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-50 text-slate-500"}
          ${open ? (DarkMode ? "bg-slate-800 text-primBtn" : "bg-slate-50 text-primBtn") : ""}
        `}
      >
        <Bell 
          size={24} 
          strokeWidth={2}
          className={unreadCount > 0 ? "text-primBtn" : "transition-colors group-hover:text-primBtn"} 
        />
        
        {/* Facebook-style Badge Positioning */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-rose-400 opacity-75"></span>
            <span className={`relative inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-black text-white shadow-sm ring-2 ${DarkMode ? "ring-slate-900" : "ring-white"}`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className={`absolute right-0 mt-4 w-[340px] sm:w-[400px] shadow-2xl rounded-[2rem] border-2 overflow-hidden z-50 origin-top-right
              ${DarkMode ? "bg-slate-900 border-slate-800 shadow-black/60" : "bg-white border-slate-100 shadow-slate-200/60"}
            `}
          >
            {/* Header */}
            <div className={`px-6 py-5 border-b flex justify-between items-center ${DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-50"}`}>
              <span className={`text-sm font-bold tracking-tight capitalize ${DarkMode ? "text-slate-100" : "text-slate-800"}`}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${DarkMode ? "bg-primBtn/10 text-primBtn" : "bg-slate-100 text-slate-600"}`}>
                  <Circle size={8} fill="currentColor" />
                  <span className="capitalize">{unreadCount} new</span>
                </div>
              )}
            </div>

            {/* List */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group p-5 border-b last:border-0 cursor-pointer transition-all relative flex gap-4
                      ${item.isRead === false 
                        ? (DarkMode ? "bg-primBtn/5 hover:bg-primBtn/10" : "bg-slate-50/50 hover:bg-slate-50") 
                        : (DarkMode ? "hover:bg-slate-800/40 opacity-50" : "hover:bg-gray-50 opacity-70")
                      }
                      ${DarkMode ? "border-slate-800/50" : "border-slate-50"}
                    `}
                  >
                    <div className={`mt-0.5 p-2.5 rounded-2xl shrink-0 h-fit
                      ${item.type === 'URGENT' 
                        ? (DarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-500") 
                        : (DarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400")
                      }`}
                    >
                      {item.type === 'URGENT' ? <AlertTriangle size={18} strokeWidth={2.5} /> : <Info size={18} strokeWidth={2.5} />}
                    </div>

                    <div className="flex-1 pr-6">
                      <p className={`text-[13px] leading-tight mb-1 transition-colors capitalize ${item.isRead === false 
                        ? (DarkMode ? "font-bold text-slate-100" : "font-bold text-slate-900") 
                        : (DarkMode ? "font-medium text-slate-500" : "font-medium text-slate-500")}`}
                      >
                        {item.title.toLowerCase()}
                      </p>
                      <p className={`text-[12px] line-clamp-2 mb-2 leading-relaxed ${DarkMode ? "text-slate-500" : "text-slate-500"}`}>
                        {item.message}
                      </p>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-bold tracking-tight opacity-60 ${DarkMode ? "text-slate-400" : "text-slate-400"}`}>
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {item.isRead === false && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-primBtn rounded-full shadow-[0_0_10px_rgba(var(--primBtn-rgb),0.5)]" />
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center px-10">
                  <div className={`w-20 h-20 rounded-[2rem] mx-auto mb-5 flex items-center justify-center ${DarkMode ? "bg-slate-800 text-slate-700" : "bg-slate-50 text-slate-200"}`}>
                    <BellOff size={36} strokeWidth={1.5} />
                  </div>
                  <p className={`text-sm font-bold mb-1 capitalize ${DarkMode ? "text-slate-300" : "text-slate-800"}`}>
                    All caught up
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}