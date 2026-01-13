import React, { useContext } from "react";
import { useDoctorContext } from "../../context/DoctorContext.jsx";
import { useEffect } from "react";
import { useAppContext } from "../../context/AppContex.jsx";
import { useAdminContext } from "../../context/AdminContext.jsx";
import { assets } from "../../assets/assets.js";
const DoctorAppointments = () => {
  const { doctortoken, docAppointments, getAppointments,markAppointmentComplete,cancelAppointment } = useDoctorContext();
  const currencySymbol = "$";
  const { calculateAge, slotDateformatted } = useAppContext();

  // console.log(docAppointments)
  useEffect(() => {
    if (doctortoken) getAppointments();
  }, [doctortoken]);

  return (
    <div className="w-[80vw] max-w-6xl m-5">
      <p className=" mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-blue-100 border  rounded  text-sm max-h-[80vh] overflow-y-scroll min-h-[60vh]">
        <div className="hidden max-sm:gap-5   gap-2 sm:grid grid-cols-[.05fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {docAppointments.reverse().map((item, idx) => (
          <div
            key={idx}
            className="flex  flex-wrap  justify-between  max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[.05fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-2 items-center text-black py-3 px-6  border-b hover:bg-blue-300 "
          >
            <p className="max-sm:hidden">{idx + 1}</p>
            <div className="flex gap-2 items-center">
              <img
                className="w-8 rounded-full bg-amber-400"
                src={item.userData.image}
                alt="patient"
              />
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-blue-500 px-2 rounded-full">
                {item.payment ? "Online" : "Cash"}
              </p>
            </div>
            <p className="max-sm:hidden ">{calculateAge(item.userData.dob) || 0}</p>
            <p>
              {slotDateformatted(item.slotDate)},{item.slotTime}
            </p>
            <p>
              {currencySymbol}
              {item.docData.fee}
            </p>
           
              
        {
          item.cancelled && 
          ! item.isCompleted  && <p className="text-xs inline text-center border text-red-500 px-2 rounded-full" >Cancelled</p>
        } 
        {
         !item.cancelled &&  item.isCompleted && <p className="text-xs inline border text-green-500 px-2 rounded-full  text-center" >Completed</p>
        }
        {
           !item.cancelled && !item.isCompleted &&  <div className="flex "> 
          <img  onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer " src={assets.cancel_icon} alt="" />
           <img onClick={()=>markAppointmentComplete(item._id)}  className="w-10 cursor-pointer" src={assets.tick_icon } alt="" />
            </div>
        }
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
