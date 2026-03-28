import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { 
  LayoutDashboard, Settings, LogOut, ChevronDown, ChevronUp, 
  Lock, User, ShieldCheck, BarChart3, 
  Briefcase, Users, CheckCircle2, ListTodo, FileText, 
  FolderTree, Building2, AlertTriangle, Clock, UserCheck, 
  XCircle, PlayCircle, Activity, Database, Menu, X, 
  AlertCircle, CalendarCheck, Layers, Timer
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../../../Redux/auth';

const Sidebar = () => {
  // Accessing DarkMode and Language from Redux
  const { Language, DarkMode } = useSelector((state) => state.webState || {});
  const { user, isLoading: isAuthLoading } = useSelector((state) => state.auth || {});
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  const dashboardUrl = "/Dashboard";
  const role = user?.role;

  const t = {
    dashboard: Language === "AMH" ? "ዳሽቦርድ" : "Dashboard",
    settings: Language === "AMH" ? "ቅንብሮች" : "Settings",
    logout: Language === "AMH" ? "ውጣ" : "Logout",
    profile: Language === "AMH" ? "መገለጫ" : "Profile",
    password: Language === "AMH" ? "የይለፍ ቃል" : "Password",
    systemSettings: Language === "AMH" ? "የስርዓት ቅንብሮች" : "System Settings"
  };

  const quickButtons = [
    { icon: Users, label: "Users", url: "/userMg", visible: role === 'ADMIN' },
    { icon: FileText, label: "Complaints", url: "/Complaintlist/admin/list/", visible: role === 'ADMIN' },
    { icon: Activity, label: "Active Case", url: "/Complaintlist/admin/active", visible: role === 'ADMIN' },
    { icon: CheckCircle2, label: "Close Case", url: "/Complaintlist/admin/closed", visible: role === 'ADMIN' },
    { icon: FolderTree, label: "Categories", url:"/CatagoryMg", visible: role === 'ADMIN' },
    { icon: Building2, label: "Department", url:"/DepartmentMg", visible: role === 'ADMIN' },
    { icon: Database, label: "Total Compilation", url: "/Complaintlist/supervisor/list/", visible: role === 'SUPERVISOR' },
    { icon: ListTodo, label: "Not Assigned", url: "/Complaintlist/supervisor/unassigned", visible: role === 'SUPERVISOR' },
    { icon: XCircle, label: "Rejected", url: "/Complaintlist/supervisor/rejected", visible: role === 'SUPERVISOR' },
    { icon: CheckCircle2, label: "Resolved", url: "/Complaintlist/supervisor/resolved", visible: role === 'SUPERVISOR' },
    { icon: AlertCircle, label: "Urgent Complaint", url: "/Complaintlist/SUPERVISOR/urgent", visible: role === 'SUPERVISOR' },
    { icon: UserCheck, label: "Active Officer", url: "/userMg", visible: role === 'SUPERVISOR' },
    { icon: Briefcase, label: "Assigned", url: "/Complaintlist/officer/assigned", visible: role === 'OFFICER' },
    { icon: PlayCircle, label: "In Progress", url: "/Complaintlist/officer/in_progress", visible: role === 'OFFICER' },
    { icon: AlertTriangle, label: "Overdue", url: "/Complaintlist/officer/overdue", visible: role === 'OFFICER' },
    { icon: CheckCircle2, label: "Resolved", url: "/Complaintlist/officer/resolved", visible: role === 'OFFICER' },
    { icon: XCircle, label: "Rejected", url: "/Complaintlist/officer/rejected", visible: role === 'OFFICER' },
    { icon: FileText, label: "Complaints", url: "/Complaintlist/admin/list/", visible: role === 'MANAGER' },
    { icon: BarChart3, label: "Reports", url: "/Report", visible: role === 'MANAGER' },
    { icon: CalendarCheck, label: "Scheduled Meetings", url: "/secretary/list/status/SCHEDULED", visible: role === 'SECRETARY' },
    { icon: CheckCircle2, label: "Approved Meetings", url: "/secretary/list/status/APPROVED", visible: role === 'SECRETARY' },
    { icon: Layers, label: "Scheduled Today", url: "/secretary/list/timeframe/today", visible: role === 'MANAGER' },
    { icon: Timer, label: "Scheduled This Week", url: "/secretary/list/timeframe/week", visible: role === 'MANAGER' },
    { icon: Activity, label: "Monthly Completed", url: "/secretary/list/stat/completed", visible: role === 'MANAGER' },
    { icon: XCircle, label: "Escalated Complaints", url: "/secretary/list/stat/escalated", visible: role === 'MANAGER' },
  ];

  const NavLink = ({ item }) => {
    if (!item.visible) return null;
    const isActive = location.pathname === item.url;
    return (
      <Link 
        to={item.url}
        onClick={() => setIsOpen(false)} 
        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-primBtn text-white shadow-lg shadow-primBtn/30' 
            : `${DarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-textColor' : 'text-slate-500 hover:bg-slate-50 hover:text-textColor'}`
        }`}
      >
        <item.icon size={18} className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
        <span className="font-semibold text-[13.5px] tracking-tight">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-[60] p-3 shadow-2xl rounded-2xl lg:hidden transition-all duration-300 
          ${DarkMode ? 'bg-slate-800 border-slate-700 text-textColor' : 'bg-white border-slate-200 text-primBtn'} 
          ${isOpen ? '-translate-x-20' : 'translate-x-0'}`}
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden 
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sidebar Main Container */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen flex flex-col z-50 transition-all duration-300
        ${DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-r border-slate-100'}
        ${isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex flex-col h-full p-6 overflow-hidden">
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-10 px-2">
            <Link to={dashboardUrl} onClick={() => setIsOpen(false)}>
              <img src="/logo1.jpg" alt="Logo" className={`w-32 h-auto max-md:hidden object-contain ${DarkMode ? 'brightness-125' : ''}`} />
            </Link>
            <button onClick={() => setIsOpen(false)} className={`lg:hidden p-2 rounded-lg ${DarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation Area */}
          <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-1">
            <section>
              <p className={`px-4 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Menu</p>
              <Link 
                to={dashboardUrl}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${
                  location.pathname === dashboardUrl 
                    ? 'bg-primBtn text-white shadow-lg shadow-primBtn/30' 
                    : `${DarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-textColor' : 'text-slate-500 hover:bg-slate-50'}`
                }`}
              >
                <LayoutDashboard size={18} />
                <span className="font-semibold text-[13.5px]">{t.dashboard}</span>
              </Link>
            </section>

            <section>
              <p className={`px-4 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${DarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Actions</p>
              <div className="space-y-1">
                {quickButtons.map((item, idx) => <NavLink key={idx} item={item} />)}
              </div>
            </section>
          </nav>

          {/* Bottom Profile/Settings Actions */}
          <div className={`mt-auto pt-6 border-t ${DarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="space-y-1">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all 
                  ${isSettingsOpen 
                    ? (DarkMode ? 'bg-slate-800 text-textColor' : 'bg-slate-50 text-textColor') 
                    : (DarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50')}`}
              >
                <div className="flex items-center space-x-3">
                  <Settings size={18} />
                  <span className="font-semibold text-sm">{t.settings}</span>
                </div>
                {isSettingsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isSettingsOpen && (
                <div className={`ml-4 mt-2 space-y-1 border-l-2 pl-4 transition-all ${DarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  <Link to="/Profile" onClick={() => setIsOpen(false)} className={`flex items-center space-x-3 py-2 text-sm transition-colors ${DarkMode ? 'text-slate-400 hover:text-textColor' : 'text-slate-500 hover:text-textColor'}`}>
                    <User size={14} /> <span>{t.profile}</span>
                  </Link>
                  <Link to="/passwordChange" onClick={() => setIsOpen(false)} className={`flex items-center space-x-3 py-2 text-sm transition-colors ${DarkMode ? 'text-slate-400 hover:text-textColor' : 'text-slate-500 hover:text-textColor'}`}>
                    <Lock size={14} /> <span>{t.password}</span>
                  </Link>
                  {role === 'ADMIN' && (
                    <Link to="/SystemMg" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 py-2 text-sm text-textColor font-bold">
                      <ShieldCheck size={14} /> <span>{t.systemSettings}</span>
                    </Link>
                  )}
                </div>
              )}

              <button 
                onClick={() =>{ dispatch(logout()); navigate('/login'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-4 font-bold border border-transparent hover:border-red-500/20"
              >
                <LogOut size={18} />
                <span className="text-sm">{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;