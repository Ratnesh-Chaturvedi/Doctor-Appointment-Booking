import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContex'
import { assets } from "../../assets/assets.js";
const AllAppointements = () => {

  const {authToken,appointments,setAppointments,getAllAppointments,cancelAppointment}=useContext(AdminContext)
  const {calculateAge,slotDateformatted,currencySymbol}=useContext(AppContext)
  useEffect(()=>{
    if(authToken)
      getAllAppointments();
  },[authToken])
  
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className=' mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-blue-100 border  rounded  text-sm max-h-[80vh] overflow-y-scroll min-h-[60vh]'>
         <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div> 
        {
          appointments.map((item,idx)=>(
            <div key={idx} className='flex  flex-wrap  justify-between  max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-black-500 py-3 px-6 border-b  hover:bg-gray-500'>
              <p className='max-sm:hidden'>{idx+1}</p>
              <div className='flex gap-2 items-center'>
                <img className='w-8 rounded-full bg-amber-400' src={item.userData.image} alt="user_img" />
                <p>{item.userData.name}</p>
              </div>
              <p className='max-sm:hidden'>
                {calculateAge(item.userData.dob)}
              </p>
              <p>{slotDateformatted(item.slotDate)},{item.slotTime}</p>
            <div className='flex gap-2 items-center'>
                <img className='w-8 rounded-full bg-blue-500' src={item.docData.image} alt="user_img" />
                <p>{item.docData.name}</p>  
              </div>
            <p>{currencySymbol}{item.docData.fee}</p>
           {item.cancelled ? <p className='text-sm font-medium  text-red-600'>Cancelled</p> : item.isCompleted ? <p className='text-sm   font-medium text-green-600'>Completed</p>: <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="cancel" /> }
            </div>
          ))
        }
      </div> 
    </div>
  )
}

export default AllAppointements