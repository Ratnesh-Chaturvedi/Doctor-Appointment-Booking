import React from 'react'
import {useAdminContext} from "../context/AdminContext"
import { assets } from '../assets/assets'
import {useNavigate} from "react-router-dom"
import { useDoctorContext } from '../context/DoctorContext'
const Navbar = () => {
    const {authToken,setAuthToken}=useAdminContext()
    const {doctortoken,setDoctorToken}=useDoctorContext();
    const navigate=useNavigate()
    const logOut=()=>{
        navigate("/")
        authToken && setAuthToken('')
        authToken && localStorage.removeItem('authToken')
        doctortoken && setDoctorToken('')
        doctortoken && localStorage.removeItem('doctortoken')
    }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className=' flex items-center  gap-2 text-xs'>
            <img className='w-36 sm:w-40 cursor-pointer ' src={assets.admin_logo} alt="" />
            <p className='border rounded-xl py-1 px-2 border-gray-500 text-xs '>{authToken?"Admin":"Doctor"}</p>
        </div>
        <button className='bg-red-500 rounded-xl px-2 py-1 text-white text-md' onClick={logOut}>LogOut </button>
    </div>
  )
}

export default Navbar