import React, { useState } from 'react'
import {assets} from "../assets/assets.js"
import { useAdminContext } from '../context/AdminContext.jsx'
import axios from "axios"
import { toast } from 'react-toastify'
import { useDoctorContext } from '../context/DoctorContext.jsx'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [state,setState]=useState("Admin")
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const {setAuthToken,backendUrl}=useAdminContext();
   const {doctortoken,setDoctorToken}=useDoctorContext();
   const navigate=useNavigate();
    const onSubmitHandler=async (e)=>{
        e.preventDefault()
        try {
            if(state==="Admin"){
                const {data}=await axios.post(backendUrl+"/api/admin/login",{email,password})
                if(data.success){
                    // here the data is the token that we get                     
                    // console.log(data.data)
                    // save the token and also save it into the localstorage to that it will logged in until it logged out 
                    localStorage.setItem("authToken",data.data)
                    setAuthToken(data.data)
                    navigate('/admin-dashboard')
                }  
            }
            else {
               const {data}=await axios.post(backendUrl+"/api/doctor/login",{email,password})
                if(data.success){
                    // here the data is the token that we get                     
                    // console.log(data.data)
                    // save the token and also save it into the localstorage to that it will logged in until it logged out 
                    navigate('/doctor-dashboard')
                    localStorage.setItem("doctortoken",data.data)
                    setDoctorToken(data.data)
            }
        }
        } catch (error) {
            // console.log(error)
        toast.error("Invalid Credentails")
        }
        setEmail('')
        setPassword('')
    }

  return (
 <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center '>
    <div className=' flex flex-col gap-3 m-auto items-start p-8 sm:min-w-96 border rounded text-black shadow-lg text-sm min-w-85 '> 
        <p className='text-center m-auto  text-2xl'><span className='text-purple-400 '>{state}</span> Login</p> 
        <div className='w-full'>
            <p>Email</p>
            <input className='border w-full  p-1 border-[#dadada]'  type="email" required 
            value={email}
            onChange={(e)=>{
                setEmail(e.target.value)
            }}
            />
        </div>
        <div className='w-full'>
            <p>Password</p>
            <input className='border w-full  p-1 border-[#dadada]'  type="password" required 
             value={password}
            onChange={(e)=>{
                setPassword(e.target.value)
            }}
            />
           
        </div>
        <button className='bg-blue-600 rounded  p-1 text-center text-white w-full '>Login</button>
        {
            state==="Admin" ? <div className='w-full text-center'>
                <p>Doctor Login? <span className='text-purple-500 underline cursor-pointer' onClick={()=>setState("Doctor")}>Click Here</span></p>
            </div> : <div className='w-full text-center'>
                <p>Admin Login? <span className='text-purple-500 underline cursor-pointer' onClick={()=>setState("Admin")}>Click Here</span></p>
            </div>
}
        </div>
 </form>
  )
}

export default Login