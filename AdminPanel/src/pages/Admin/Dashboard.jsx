import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useContext } from 'react'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContex'
const Dashboard = () => {
  const {authToken,dashboardData,getDasboardData,cancelAppointment}= useContext(AdminContext)
  const {slotDateformatted}=useContext(AppContext)
  useEffect(()=>{
    if(authToken) getDasboardData();
  },[authToken])
  return dashboardData && (
    <div className='w-full max-w-6xl m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl'>
              {dashboardData.doctors}
            </p>
            <p>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl'>
              {dashboardData.appointments}
            </p>
            <p>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl'>
              {dashboardData.users}
            </p>
            <p>Patients</p>
          </div>
        </div>
      </div>
      <div className='bg-white'>
        <div className='flex items-center gap-3 p-4 mt-10  rounded-t  border '>
          <img src={assets.list_icon} alt="" />
          <p className='text-sm'>Latest Appointments</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {
            dashboardData.latestAppointments.map((item,idx)=>(
              <div key={idx} className='flex  items-center py-3 px-6 gap-3 hover:bg-gray-100'>
                <img className='w-14 rounded-full bg-blue-400' src={item.docData.image} alt="" />
                <div className=' flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p  className='text-gray-600'>{slotDateformatted(item.slotDate)}</p>
                </div>
                 {item.cancelled? <p className='text-sm font-medium text-red-600 border px-2 rounded-full'>Cancelled</p> :item.isCompleted? <p className='text-sm font-medium text-green-600 border px-2 rounded-full'>Completed</p>:<img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="cancel" /> }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard