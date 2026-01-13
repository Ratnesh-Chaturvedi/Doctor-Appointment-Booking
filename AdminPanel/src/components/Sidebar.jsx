import React from 'react'
import { useAdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { useDoctorContext } from '../context/DoctorContext';
const Sidebar = () => {
  const {authToken}=useAdminContext();
  const {doctortoken}=useDoctorContext();
  return (
    <div className='min-h-screen '>
      {
        authToken && <ul className='flex  flex-col gap-5 py-3 bg-white h-full'>
          <NavLink to={"/admin-dashboard"} className={({isActive})=>`flex  items-center gap-3  py-3.5 px-3 md:px-9  md-min-w-72 cursor-pointer ${isActive?'border-r-4 border-blue-500 bg-blue-200':''}`}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block' >Dashboard</p>
          </NavLink>
          <NavLink to={"/all-appointments"} className={({isActive})=>`flex  items-center gap-3  py-3.5 px-3 md:px-9  md-min-w-72 cursor-pointer ${isActive?'border-r-4 border-blue-500 bg-blue-200':''}`}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>All Appointments</p>
          </NavLink>
          <NavLink to={"/add-doctor"} className={({isActive})=>`flex  items-center gap-3  py-3.5 px-3 md:px-9  md-min-w-72 cursor-pointer     ${isActive?'border-r-4 border-blue-500 bg-blue-200':''}`}>
            <img src={assets.add_icon} />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink to={"/doctor-list"} className={({isActive})=>`flex  items-center gap-3  py-3.5 px-3 md:px-9  md-min-w-72 cursor-pointer ${isActive?'border-r-4 border-blue-500 bg-blue-200':''}`}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctor List</p>
          </NavLink>
        </ul> 
}
{
   doctortoken && <ul className='flex  flex-col gap-5  py-3 bg-white h-full '>
          <NavLink to={"/doctor-dashboard"} className={({isActive})=>`flex  items-center gap-3  py-3.5 px-3 md:px-9  md-min-w-72 cursor-pointer ${isActive?'border-r-4 border-blue-500 bg-blue-200':''}`}>
            <img src={assets.home_icon} alt="" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink to={"/doctor-appointments"} className={({isActive})=>`flex  items-center gap-3  py-3.5 px-3 md:px-9  md-min-w-72 cursor-pointer ${isActive?'border-r-4 border-blue-500 bg-blue-200':''}`}>
            <img src={assets.appointment_icon} alt="" />
            <p className='hidden md:block'>All Appointments</p>
          </NavLink>

          <NavLink to={"/doctor-profile"} className={({isActive})=>`flex  items-center gap-3  py-3.5 px-3 md:px-9  md-min-w-72 cursor-pointer ${isActive?'border-r-4 border-blue-500 bg-blue-200':''}`}>
            <img src={assets.people_icon} alt="" />
            <p className='hidden md:block'>Doctor Profile</p>
          </NavLink>
        </ul> 
      }
    </div>
  )
}

export default Sidebar