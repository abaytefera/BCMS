import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { 
  LayoutDashboard, Settings, LogOut, ChevronDown, ChevronUp, 
  Lock, User, ShieldCheck, BarChart3, 
  Briefcase, Users, CheckCircle2, ListTodo, FileText, 
  FolderTree, Building2, AlertTriangle, Clock, UserCheck, 
  XCircle, PlayCircle, Activity, Database, Menu, X 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../../../Redux/auth';

const Sidebar = () => {
  const { Language } = useSelector((state) => state.webState || {});
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

  const dashboardUrl ="/Dashboard"
  const role = user?.role;

  const t = {
    mainMenu: Language === "AMH" ? "ዋና ማውጫ" : "Main Menu",
    quickActions: Language === "AMH" ? "ፈጣን እርምጃዎች" : "Quick Actions",
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
 
    { icon: UserCheck, label: "Active Officer", url: "/userMg", visible: role === 'SUPERVISOR' },
    { icon: Briefcase, label: "Assigned", url: "/Complaintlist/officer/assigned", visible: role === 'OFFICER' },
    { icon: PlayCircle, label: "In Progress", url: "/Complaintlist/officer/in_progress", visible: role === 'OFFICER' },
    { icon: AlertTriangle, label: "Overdue", url: "/Complaintlist/officer/overdue", visible: role === 'OFFICER' },
    { icon: CheckCircle2, label: "Resolved", url: "/Complaintlist/officer/resolved", visible: role === 'OFFICER' },
    { icon: XCircle, label: "Rejected", url: "/Complaintlist/officer/rejected", visible: role === 'OFFICER' },
    { icon: FileText, label: "Complaints", url: "/Complaintlist/admin/list/", visible: role === 'MANAGER' },
    
    { icon: BarChart3, label: "Reports", url: "/Report", visible: role === 'MANAGER' },
  ];


  const NavLink = ({ item }) => {
    if (!item.visible) return null;
    const isActive = location.pathname === item.url;
    return (
      <Link 
        to={item.url}
        onClick={() => setIsOpen(false)} 
        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${
          isActive ? 'bg-primBtn text-white shadow-md' : 'text-slate-500 hover:bg-emerald-50 hover:text-textColor'
        }`}
      >
        <item.icon size={18} />
        <span className="font-medium text-[13px]">{item.label}</span>
      </Link>
    
    );
  };

  return (
    <>
      {/* 1. THE FLOATING BUTTON (Visible only on mobile when sidebar is closed) */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-[60] p-3 bg-white border border-slate-200 shadow-xl rounded-2xl text-emerald-600 lg:hidden transition-transform duration-300 ${isOpen ? '-translate-x-20' : 'translate-x-0'}`}
      >
        <Menu size={24} />
      </button>

      {/* 2. OVERLAY (Dims the screen on mobile) */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* 3. THE SIDEBAR */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-100 flex flex-col z-50 transition-all duration-300 shadow-2xl lg:shadow-none
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}`}>
        
        {/* Close button inside sidebar (Mobile only) */}
        <div className="lg:hidden absolute right-4 top-4">
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col h-full p-4 overflow-hidden">
          <div className="flex-shrink-0  self-center mb-8 px-2">
            <Link to={dashboardUrl} onClick={() => setIsOpen(false)}>
              <img src="/logo1.jpg" alt="Logo" className="w-30 h-25" />
            </Link>
          </div>

          <nav className="flex-1 space-y-7 overflow-y-auto no-scrollbar">
            <section>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{}</p>
              <Link    textColor
             
                to={dashboardUrl}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${location.pathname === dashboardUrl ? 'bg-primBtn text-white shadow-md' : 'text-slate-500 hover:bg-emerald-50'}`}
              >
                <LayoutDashboard size={18} />
                <span className="font-medium text-[13px]">{t.dashboard}</span>
              </Link>
            </section>

            <section>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{}</p>
              <div className="space-y-0.5">
                {quickButtons.map((item, idx) => <NavLink key={idx} item={item} />)}
              </div>
            </section>
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-1">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors ${isSettingsOpen ? 'bg-slate-50 text-textColor' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center space-x-3">
                <Settings size={18} />
                <span className="font-medium text-sm">{t.settings}</span>
              </div>
              {isSettingsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isSettingsOpen && (
              <div className="ml-4 space-y-0.5 mt-1 border-l-2 border-slate-50">
                <Link to="/Profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-500 hover:text-textColor">
                  <User size={14} /> <span>{t.profile}</span>
                </Link>
                <Link to="/passwordChange" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-500 hover:text-textColor">
                  <Lock size={14} /> <span>{t.password}</span>
                </Link>
                {role === 'ADMIN' && (
                  <Link to="/SystemMg" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-2 text-sm text-textColor font-semibold bg-emerald-50/50 rounded-lg">
                    <ShieldCheck size={14} /> <span>{t.systemSettings}</span>
                  </Link>
                )}
               


              </div>
            )}

            <button 
              onClick={() =>{ dispatch(logout()); navigate('/login'); }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-2"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;