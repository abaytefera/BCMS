import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit3, Save, X, User as UserIcon, Phone as PhoneIcon, 
  Mail, Building, Loader2, Camera, UserCheck, Shield 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../Redux/profileApi';
import Sidebar from '../../Component/AuthenticateComponent/OfficerComponet/DashboardPage1Component/Sidebar';
import AuthHeader from '../../Component/AuthenticateComponent/AuthHeader';
import ProfileField from '../../Component/AuthenticateComponent/WorkProfileComponent/ProfileField';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/auth';

const WorkProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { DarkMode } = useSelector((state) => state.webState || {});

  const { data: user, isLoading, error } = useGetProfileQuery(); 
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [tempUser, setTempUser] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (user) {
      setTempUser({ 
        name: user.full_name || "", 
        phone: user.phone_number || "" 
      });
    }
  }, [user]);

  useEffect(() => {
    if (error?.status === 401) {
      dispatch(logout());
      localStorage.removeItem('authToken');
      navigate('/login', { replace: true });
    }
  }, [error, navigate, dispatch]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success("Image preview updated", {
          style: { borderRadius: '12px', background: DarkMode ? '#1e293b' : '#fff', color: DarkMode ? '#fff' : '#333' }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    const updatePromise = updateProfile({ 
      full_name: tempUser.name, 
      phone_number: tempUser.phone, 
      profileImage 
    }).unwrap();

    toast.promise(updatePromise, {
      loading: 'Synchronizing profile...',
      success: () => {
        setIsEditing(false);
        return 'Profile updated successfully!';
      },
      error: (err) => `Update failed: ${err.data?.message || 'Server Error'}`,
    }, {
      style: {
        borderRadius: '15px',
        background: DarkMode ? '#0f172a' : '#1e293b',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
      },
      success: {
        duration: 4000,
        iconTheme: { primary: '#10b981', secondary: '#fff' },
      },
    });
  };

  if (isLoading) return (
    <div className={`min-h-screen flex items-center justify-center ${DarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <Loader2 className="animate-spin text-primBtn" size={48} />
    </div>
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${DarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar role="manager" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AuthHeader True={true} />
        
        <main className={`flex-1 pt-32 pb-20 px-4 md:px-8 transition-colors duration-300 ${DarkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
          <div className="max-w-4xl mx-auto">
            
            {/* SaaS Profile Card */}
            <div className={`border rounded-[3rem] shadow-xl overflow-hidden relative transition-all duration-300 ${DarkMode ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
              
              {/* Header Banner - SaaS Aesthetic */}
              <div className="h-48 bg-primBtn relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                
                {/* Profile Image Trigger */}
                <div className="absolute -bottom-16 left-12 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <div className={`p-1.5 rounded-[2.5rem] shadow-2xl border transition-colors duration-300 ${DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className={`w-36 h-36 rounded-[2.2rem] flex items-center justify-center overflow-hidden relative ${DarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      {profileImage || user?.profile_image ? (
                        <img src={profileImage || user?.profile_image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={56} className={DarkMode ? 'text-slate-700' : 'text-slate-300'} />
                      )}
                      <div className="absolute inset-0 bg-primBtn/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                        <Camera className="text-white" size={28} />
                      </div>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>

              {/* Card Content */}
              <div className="pt-24 pb-12 px-8 md:px-14">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                  <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight capitalize">
                      <span className="text-primBtn">profile</span>
                    </h1>
                    <div className={`flex items-center gap-2 text-sm font-semibold capitalize ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Shield size={14} className="text-primBtn" />
                      {user?.role?.toLowerCase() }
                    </div>
                  </div>

                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black capitalize transition-all border
                        ${DarkMode 
                          ? 'border-slate-700 hover:border-primBtn hover:bg-primBtn/10 text-slate-300' 
                          : 'border-slate-200 hover:border-primBtn/30 hover:bg-slate-50 text-slate-700 shadow-sm'}`}
                    >
                      <Edit3 size={16} /> Edit profile
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className={`p-4 rounded-2xl transition-all border
                        ${DarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600'}`}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <ProfileField 
                    label="Full name" 
                    value={tempUser.name} 
                    icon={UserIcon} 
                    isEditing={isEditing} 
                    onChange={(val) => setTempUser({...tempUser, name: val})} 
                  />
                  <ProfileField 
                    label="Contact number" 
                    value={tempUser.phone} 
                    icon={PhoneIcon} 
                    isEditing={isEditing} 
                    onChange={(val) => setTempUser({...tempUser, phone: val})} 
                  />
                  <ProfileField label="Access email" value={user?.username} icon={Mail} isEditing={false} />
                  <ProfileField label="Departmental unit" value={user?.Department?.name} icon={Building} isEditing={false} />
                </div>

                {/* Save Action */}
                {isEditing && (
                  <div className="mt-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button 
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="w-full bg-primBtn disabled:bg-slate-300 text-white text-sm font-black capitalize py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-primBtn/20 active:scale-95"
                    >
                      {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <UserCheck size={20} />}
                      {isUpdating ? 'updating...' : 'update'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
          
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkProfile;