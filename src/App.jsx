import { useState } from 'react'
import reactLogo from './assets/react.svg'



import { HiLogin } from 'react-icons/hi'
import { BrowserRouter , Routes, Route } from "react-router-dom";


import LoginPage from './Pages/CitizenPages/LoginPage'
import ComplaintListPage from './Pages/AuthenticationPage/ComplaintListPage'
import ComplaintDetails from './Pages/AuthenticationPage/OfficerPage/ComplaintDetails'
import AssignComplaintPage from './Pages/AuthenticationPage/SupervisorPage/AssignComplaintPage'
import NotAssignedComplaintListPage from './Pages/AuthenticationPage/NotAssignedComplaintListPage'
import UserManagementPage from './Pages/AuthenticationPage/UserManagementPage/UserManagementPage'
import DepartmentManagement from './Pages/AuthenticationPage/DepartmentManagementPage/DepartmentManagement'
import CategoryManagement from './Pages/AuthenticationPage/CategoryManagementPage/CategoryManagement'
import SystemSettings from './Pages/AuthenticationPage/SystemSettingsPage/SystemSettings'
import ChangePasswordPage from './Pages/AuthenticationPage/ChangePasswordPage/ChangePasswordPage'
import WorkProfile from './Pages/AuthenticationPage/WorkProfilepage'
import ReportsPage from './Pages/AuthenticationPage/ReportsPage/ReportsPage'
import Dashboard from './Pages/MainDashboard'
// import SecretaryDashboard from './Pages/SecretaryDashboard/SecretaryDashboard';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={LoginPage}> </Route>
 
         <Route path='/login' Component={LoginPage}></Route>
      
         
       
          <Route path='/Complaintlist/:role/:type' Component={ComplaintListPage} />
          <Route path="/:role/list/:type/:value" element={<ComplaintListPage />} />

         <Route path="/Complaintlist/:role/:type" element={<ComplaintListPage />} />
              <Route path='/DetailList/:id' element={<ComplaintDetails />} />
              
              <Route path='/AssignComplain/:id' element={<AssignComplaintPage/>}></Route>
                 <Route path='/NotAssignComplainList/:role/:type' element={<NotAssignedComplaintListPage/>}></Route>
                     <Route path='/userMg' element={<UserManagementPage/>}></Route>
                      <Route path='/DepartmentMg' element={<DepartmentManagement/>}></Route>
                       <Route path='/CatagoryMg' element={<CategoryManagement/>}></Route>
                    <Route path='/SystemMg' element={<SystemSettings/>}></Route>
                     <Route path='/passwordChange' element={<ChangePasswordPage/>}></Route>
                           <Route path='/Profile' element={<WorkProfile/>}></Route>
                       <Route path='/Report' element={<ReportsPage/>}></Route>
          
                       <Route path='/Dashboard' element={<Dashboard/>}></Route>
                     
      
         
</Routes>
</BrowserRouter>
  
    </>
  )
}

export default App
