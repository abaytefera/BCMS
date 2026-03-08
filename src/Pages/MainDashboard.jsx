import React, { useEffect } from 'react';
import { useSelector,useDispatch } from "react-redux";

// Double check these paths match your folder structure exactly
import AdminDashboard from './AuthenticationPage/AdminDashboardPage/AdminDashboard';
import OfficerPage1 from './AuthenticationPage/OfficerPage/DashboardPage1';
import SupervisorDashboard from './AuthenticationPage/SupervisorPage/SupervisorDashboard';
import ManagementDashboard from './AuthenticationPage/ManagementDashboardPage/ManagementDashboard';
import { useNavigate } from 'react-router-dom';
import SecretaryDashboard from './SecretaryDashboard/SecretaryDashboard';
import { logout } from '../Redux/auth';
const Dashboard = () => {
  // Pull loading state and user from auth slice
  const { user, isloading } = useSelector((state) => state.auth );
  const Dispatch=useDispatch()
  const navigator=useNavigate();
  

  if (isloading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const role =user?.role

  useEffect(()=>{
  
    if(!user){
Dispatch(logout());
  localStorage.removeItem('authToken');
   Dispatch(logout());
navigator('/')

    }

  },[user])

  // 2. Render the dashboard based on role
  switch (role) {
    case "ADMIN":
      return <AdminDashboard />;
    OFFICER
    case "OFFICER":
      return <OfficerPage1 />;
    
    case "SUPERVISOR":
      return <SupervisorDashboard />;
    
    case "MANAGER":
      return <ManagementDashboard />;
    case  "SECRETARY":
      return <SecretaryDashboard></SecretaryDashboard>
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-gray-500 mt-2">Role detected: <strong>{role || "None"}</strong></p>
            <p className="text-gray-400 text-sm mt-1">Please contact your administrator.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;