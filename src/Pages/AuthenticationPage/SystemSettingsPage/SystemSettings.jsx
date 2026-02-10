import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Globe, Save, Send, Loader2 } from 'lucide-react';
import { useGetSystemSettingsQuery, useUpdateSettingsMutation } from '../../../Redux/settingsApi';
import Sidebar from '../../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../../Component/AuthenticateComponent/AuthHeader';
import SettingCard from '../../../Component/AuthenticateComponent/SystemSettingsComponent/SettingCard';
import { ToggleRow, SettingInput } from '../../../Component/AuthenticateComponent/SystemSettingsComponent/ToggleRow';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../Redux/auth';
import { useDispatch } from 'react-redux';
const SystemSettings = () => {
  const navigate = useNavigate();
  const Dispath=useDispatch()
  // 1. Fetch Data from Node.js
  const { data: serverSettings, isLoading, error } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [form, setForm] = useState({});

  // --- 401 REDIRECT LOGIC ---
  useEffect(() => {
    if (error && error.status === 401) {
      localStorage.removeItem('authToken');
            Dispath(logout())
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);
  // --------------------------

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
    try {
      await updateSettings(form).unwrap();
      alert("System configuration updated successfully!");
    } catch (err) {
      alert("Failed to save settings: " + err.data?.message);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="animate-spin text-textColor" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white text-slate-800">
      <Sidebar role="admin" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className="flex-1 pt-32 px-6 lg:px-10 pb-20 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-12">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter  leading-none">
                System <span className="text-textColor">Settings</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-3 ml-1">
                Platform Configuration & Global Rules
              </p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              
              {/* SMS GATEWAY */}
              <SettingCard title="SMS Gateway" icon={MessageSquare} colorClass="border-blue-100 bg-white">
                <ToggleRow 
                  label="Enable SMS Notifications" 
                  active={form.smsEnabled || false}
                  onClick={() => handleInputChange('smsEnabled', !form.smsEnabled)}
                />
                <SettingInput 
                  label="Gateway API Key" 
                  value={form.smsApiKey || ''}
                  onChange={(e) => handleInputChange('smsApiKey', e.target.value)}
                  type="password" 
                />
                <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all border border-blue-100">
                  <Send size={14} /> Send Test SMS
                </button>
              </SettingCard>

              {/* EMAIL INTEGRATION */}
              <SettingCard title="Email Integration" icon={Mail} colorClass="border-purple-100 bg-white">
                <SettingInput 
                  label="SMTP Host" 
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
              <SettingCard title="Language & Region" icon={Globe} colorClass="border-emerald-100 bg-white">
                <div className="space-y-1 mb-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interface Language</label>
                  <select 
                    value={form.language || 'English (US)'}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option>English (US)</option>
                    <option>Amharic (Ethiopia)</option>
                  </select>
                </div>
                <ToggleRow 
                    label="Auto-detect Timezone" 
                    active={form.autoTimezone || false}
                    onClick={() => handleInputChange('autoTimezone', !form.autoTimezone)}
                />
              </SettingCard>

              {/* SECURITY OPTIONS */}
              <SettingCard title="Security Options" icon={Globe} colorClass="border-rose-100 bg-white">
                <ToggleRow 
                    label="Two-Factor Authentication" 
                    active={form.twoFactor || false}
                    onClick={() => handleInputChange('twoFactor', !form.twoFactor)}
                />
                <ToggleRow 
                    label="Maintenance Mode" 
                    active={form.maintenanceMode || false}
                    onClick={() => handleInputChange('maintenanceMode', !form.maintenanceMode)}
                />
              </SettingCard>

            </div>

            {/* GLOBAL SAVE ACTION */}
            <div className="flex justify-center">
              <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className="w-full max-w-md py-5 bg-textColor rounded-[2rem] text-white font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-emerald-200  hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isSaving ? "Synchronizing..." : "Save All Changes"}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemSettings;
