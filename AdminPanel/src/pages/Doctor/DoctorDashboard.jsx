import React from "react";
import { useDoctorContext } from "../../context/DoctorContext";
import { useAppContext } from "../../context/AppContex";
import { assets } from "../../assets/assets";
import { useEffect } from "react";

const DoctorDashboard = () => {
  const {
    dashData,
    doctortoken,
    getDashboardData,
    markAppointmentComplete,
    cancelAppointment,
  } = useDoctorContext();

  const { slotDateformatted,currencySymbol } = useAppContext();

  useEffect(() => {
    if (doctortoken) {
      getDashboardData()
    }
  }, [doctortoken]);

  return (
    dashData && (
      <div className="m-5 w-[80vw]">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl">{currencySymbol}{dashData.earning}</p>
              <p>Earning</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl">{dashData.appointmentCount}</p>
              <p>Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl">{dashData.patients}</p>
              <p>Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-3 p-4 mt-10  rounded-t  border ">
            <img src={assets.list_icon} alt="" />
            <p className="text-sm">Latest Appointments</p>
          </div>
          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((item, idx) => (
              <div
                key={idx}
                className="flex  items-center py-3 px-6 gap-3 hover:bg-gray-100"
              >
                <img
                  className="w-14 rounded-full bg-blue-400"
                  src={item.userData.image}
                  alt=""
                />
                <div className=" flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateformatted(item.slotDate)},{item.slotTime}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-sm font-medium text-red-600 border  rounded-full px-2">Cancelled</p>
                ) : (
                  <div>
                    {
                              item.cancelled && 
                              ! item.isCompleted  && <p className="text-xs inline border text-red-500 px-2 rounded-full" >Cancelled</p>
                            } 
                            {
                             !item.cancelled &&  item.isCompleted && <p className="text-xs inline border text-green-500 px-2 rounded-full " >Completed</p>
                            }
                            {
                               !item.cancelled && !item.isCompleted &&  <div className="flex "> 
                              <img  onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer " src={assets.cancel_icon} alt="" />
                               <img onClick={()=>markAppointmentComplete(item._id)}  className="w-10 cursor-pointer" src={assets.tick_icon } alt="" />
                                </div>
                            }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
