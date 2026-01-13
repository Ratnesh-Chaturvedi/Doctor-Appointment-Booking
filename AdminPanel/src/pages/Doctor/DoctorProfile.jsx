import React from 'react'
import { useDoctorContext } from '../../context/DoctorContext'
import { useAppContext } from '../../context/AppContex';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const {profileData,getProfileData,doctortoken,setProfileData,backendUrl}=useDoctorContext();
  const {currencySymbol}=useAppContext();
  const [isEdit,setIsEdit]=useState(false);

  const updateProfile=async ()=>{
    try {
      const updatedData={
      fee:profileData.fee,
      available:profileData.available,
       address:profileData.address
      }
      const {data}=await axios.patch(backendUrl+'/api/doctor/update-profile',updatedData,{headers:{doctortoken}})
      if(data.success){
        toast.success("Profile updated")
        setIsEdit(false)
        getProfileData();
      }else{
        toast.error(data.message)
      }
    
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(()=>{
  if(doctortoken)getProfileData();
  },[doctortoken])



  return profileData && (
   <div className='w-[80vw]'>
    <div className=' flex flex-col gap-4 m-5'>
      <p className='text-xl font-medium'>Doctor Profile</p>
      <div>
        <img className='bg-blue-400 w-full sm:max-w-64 rounded' src={profileData.image} alt="docImg" />
      </div>
      {/* Doctor experience */}
      <div className='flex-1 border border-stone-100 rounded-lg px-8 py-7 bg-white' >

      <p className=' flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
      <div className='flex items-center gap-2 mt-1 text-gray-600'>
        <p>{profileData.degree}-{profileData.speciality}</p>
        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
      </div>
      {/* doctor about  */}
      <div>
        <p className='flex items-center gap-1 text-sm  font-medium text-neutral-700 mt-3'>About:</p>
        <p className='text-sm text-gray-600 max-w-[600px] mt-1'> {profileData.about}</p>
      </div>
      <p className='text-gray-600 mt-4 font-medium'>Appointment Fee: <span className='text-gray-800'>{currencySymbol} <span>
        </span>{isEdit?<input className='bg-white text-black border rounded' type="number" value={profileData.fee} onChange={(e)=>setProfileData(prev=>({...prev,fee:(e.target.value)}))} /> : profileData.fee}</span></p>
      <div className='flex py-2 gap-2'>
        <p>Address:</p>
        <p className='text-sm'>{isEdit?<input type="text" className='bg-white text-black border rounded' value={profileData.address.line1} onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} />:profileData.address.line1}
          <br />
         {isEdit?<input type="text" className='bg-white text-black border rounded' value={profileData.address.line2} onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))} />:profileData.address.line2}
        </p>
      </div>
      <div className='flex gap-2 pt-1'>
        <input onChange={()=> isEdit && setProfileData(prev=> ({...prev,available:!prev.available}))} checked={profileData.available } type="checkbox"  id="available" />
        <label htmlFor="available">Available</label>
      </div>

      {
        isEdit?
      <button onClick={updateProfile} className='px-4 py-1  border border-blue-400 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all'> Save Information</button>:
      <button onClick={()=>setIsEdit(true)} className='px-4 py-1  border border-blue-400 text-sm rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all'> Edit</button>

      }
    </div>
      </div>
   </div>
  )
}

export default DoctorProfile