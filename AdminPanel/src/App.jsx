import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { useAdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from "./pages/Admin/Dashboard.jsx"
import AddDoctor from './pages/Admin/AddDoctor';
import AllAppointements from './pages/Admin/AllAppointements.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import { useDoctorContext } from './context/DoctorContext.jsx';
import DoctorDasboard from "./pages/Doctor/DoctorDashboard.jsx"
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx"
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx"

const App = () => {
  const {authToken}=useAdminContext();
  const {doctortoken}=useDoctorContext();
  return authToken || doctortoken?(
    <div className='bg-[rgb(215,223,255)]'>
    <ToastContainer/>
 <Navbar/>
 <div className='flex item-start'>
  <Sidebar/>
  <Routes>
    {/* Admin routes */}
    <Route path="/" element={<></>}  />
    <Route path="/admin-dashboard" element={<Dashboard/>}/>
    <Route path="/all-appointments" element={<AllAppointements/>}/>
    <Route path="/add-doctor" element={<AddDoctor/>}/>
    <Route path="/doctor-list" element={<DoctorList/>}/>

    {/* Doctor routes */}
     <Route path="/doctor-dashboard" element={<DoctorDasboard/>}/>
     <Route path="/doctor-appointments" element={<DoctorAppointments/>}/>
     <Route path="/doctor-profile" element={<DoctorProfile/>}/>
  </Routes>
 </div>
    </div>
  ):(
    <>
    <Login/>
       <ToastContainer/>
    </>
  )
}

export default App