import { useState, useRef, useEffect } from "react";
import { Bell, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);

  // Helper to get token (Standard Bearer Token format)
  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. Fetch Notifications (GET)
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/notifications`, {
        headers: getAuthHeader(), // Added Token Here
      });
      return response.data.filter((item) => item.id !== null);
    },
    refetchInterval: 300,
    // Ensure it doesn't try to fetch if there is no token
    enabled: !!localStorage.getItem("authToken"), 
  });

  // 2. Mark as Read Mutation (PUT)
  const markAsReadMutation = useMutation({
    mutationFn: async ({ id }) => {
      // axios.put(url, data, config)
      return await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
        headers: getAuthHeader(), // Added Token Here
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["notifications"]);
      navigate(`/DetailList/${variables.complaintId}`);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
    }
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
        className="relative p-2.5 rounded-full transition-all hover:bg-gray-100 active:scale-90 focus:outline-none"
      >
        <Bell size={24} className={unreadCount > 0 ? "text-blue-600" : "text-gray-500"} />
       {unreadCount > 0 && (
  <span className="absolute -top-1 -right-1 flex items-center justify-center">
    {/* Ping Animation */}
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    
    {/* The Badge */}
    <span className="relative inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 border-2 border-white text-[11px] font-bold text-white shadow-sm">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  </span>
)}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden z-50 origin-top-right"
          >
            <div className="px-4 py-3 border-b bg-gray-50/50 flex justify-between items-center">
              <span className="font-bold text-gray-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group p-4 border-b last:border-0 cursor-pointer transition-all relative
                      ${item.isRead === false ? "bg-blue-50/40 hover:bg-blue-50" : "hover:bg-gray-50 opacity-80"}
                    `}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 p-2 rounded-lg shrink-0 ${item.type === 'URGENT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {item.type === 'URGENT' ? <AlertTriangle size={16} /> : <Info size={16} />}
                      </div>

                      <div className="flex-1">
                        <p className={`text-sm leading-tight ${item.isRead === false ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {item.isRead === false && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <CheckCircle className="text-gray-300 mx-auto mb-3" size={32} />
                  <p className="text-sm text-gray-900 font-semibold">All caught up!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}