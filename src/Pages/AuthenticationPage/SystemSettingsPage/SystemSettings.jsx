import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Globe, Save, Send, Loader2, ShieldCheck, Settings2 } from 'lucide-react';
import { useGetSystemSettingsQuery, useUpdateSettingsMutation } from '../../../Redux/settingsApi';
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import SettingCard from '../../../Component/AuthenticateComponent/SystemSettingsComponent/SettingCard';
import { ToggleRow, SettingInput } from '../../../Component/AuthenticateComponent/SystemSettingsComponent/ToggleRow';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../Redux/auth';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const SystemSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { DarkMode } = useSelector((state) => state.webState || {});
  
  // 1. Fetch Data
  const { data: serverSettings, isLoading, error } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [form, setForm] = useState({});

  // --- 401 REDIRECT LOGIC ---
  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  }, [error, navigate, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (serverSettings) setForm(serverSettings);
  }, [serverSettings]);

  const handleInputChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleGlobalSave = async () => {
    const toastId = toast.loading("Updating configurations...");
    try {
      await updateSettings(form).unwrap();
      toast.success("System configurations updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to save settings: " + (err.data?.message || "Unknown error"), { id: toastId });
    }
  };

  if (isLoading) return (
    <div className={`min-h-screen flex items-center justify-center ${DarkMode ? "bg-slate-950" : "bg-white"}`}>
      <Loader2 className="animate-spin text-primBtn" size={48} />
    </div>
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"}`}>
      <Toaster position="top-right" />
      <Sidebar role="admin" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className={`flex-1 pt-28 px-6 lg:px-10 pb-20 overflow-y-auto transition-colors duration-300 ${DarkMode ? "bg-slate-950" : "bg-slate-50/50"}`}>
          <div className="max-w-6xl mx-auto">
            
            {/* SaaS Header Section */}
            <div className="mb-12 flex items-center gap-4">
               <div className={`p-3 rounded-2xl ${DarkMode ? "bg-primBtn/10 text-primBtn" : "bg-primBtn/5 text-primBtn"}`}>
                  <Settings2 size={32} />
               </div>
               <div>
                  <h1 className="text-4xl font-black tracking-tight leading-none capitalize">
                    System <span className="text-textColor">settings</span>
                  </h1>
                  <p className={`text-sm font-medium mt-2 capitalize ${DarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Platform configuration & global rule engine
                  </p>
               </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              
              {/* SMS GATEWAY */}
              <SettingCard title="Sms gateway" icon={MessageSquare} colorClass={DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-blue-50"}>
                <ToggleRow 
                  label="Enable sms notifications" 
                  active={form.smsEnabled || false}
                  onClick={() => handleInputChange('smsEnabled', !form.smsEnabled)}
                />
                <SettingInput 
                  label="Gateway api key" 
                  value={form.smsApiKey || ''}
                  onChange={(e) => handleInputChange('smsApiKey', e.target.value)}
                  type="password" 
                />
                <button className={`w-full py-3.5 rounded-xl text-xs font-black capitalize tracking-wide flex items-center justify-center gap-2 transition-all border
                  ${DarkMode 
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" 
                    : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"}`}>
                  <Send size={14} /> Send test sms
                </button>
              </SettingCard>

              {/* EMAIL INTEGRATION */}
              <SettingCard title="Email integration" icon={Mail} colorClass={DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-purple-50"}>
                <SettingInput 
                  label="Smtp host" 
                  value={form.smtpHost || ''} 
                  onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <SettingInput 
                    label="Port" 
                    value={form.smtpPort || ''} 
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                  />
                  <SettingInput 
                    label="Encryption" 
                    value={form.encryption || ''}
                    onChange={(e) => handleInputChange('encryption', e.target.value)}
                  />
                </div>
              </SettingCard>

              {/* LANGUAGE & REGION */}
              <SettingCard title="Language & region" icon={Globe} colorClass={DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-emerald-50"}>
                <div className="space-y-2 mb-4">
                  <label className={`text-[11px] font-black capitalize tracking-wide ml-1 ${DarkMode ? "text-slate-500" : "text-slate-400"}`}>Interface language</label>
                  <select 
                    value={form.language || 'English (US)'}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3.5 text-sm outline-none transition-all appearance-none cursor-pointer
                      ${DarkMode ? "bg-slate-800/50 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                  >
                    <option>English (US)</option>
                    <option>Amharic (Ethiopia)</option>
                  </select>
                </div>
                <ToggleRow 
                    label="Auto-detect timezone" 
                    active={form.autoTimezone || false}
                    onClick={() => handleInputChange('autoTimezone', !form.autoTimezone)}
                />
              </SettingCard>

              {/* SECURITY OPTIONS */}
              <SettingCard title="Security options" icon={ShieldCheck} colorClass={DarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-rose-50"}>
                <ToggleRow 
                    label="Two-factor authentication" 
                    active={form.twoFactor || false}
                    onClick={() => handleInputChange('twoFactor', !form.twoFactor)}
                />
                <ToggleRow 
                    label="Maintenance mode" 
                    active={form.maintenanceMode || false}
                    onClick={() => handleInputChange('maintenanceMode', !form.maintenanceMode)}
                />
              </SettingCard>

            </div>

            {/* Global Save Action */}
            <div className="flex justify-center">
              <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className={`w-full max-w-md py-5 rounded-[2rem] text-white font-black capitalize tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50
                  ${DarkMode ? "bg-primBtn shadow-primBtn/20" : "bg-textColor shadow-textColor/20"}`}
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isSaving ? "Synchronizing data..." : "Save all changes"}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemSettings;