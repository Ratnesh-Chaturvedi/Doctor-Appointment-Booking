import { useState } from "react";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const DoctorContext = createContext();

export const DoctorContextProvider = (props) => {
  const [doctortoken, setDoctorToken] = useState(
    localStorage.getItem("doctortoken") || ""
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [docAppointments, setDocAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData,setProfileData]=useState(false)
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/doc-appointments",
        { headers: { doctortoken } }
      );
      if (data.success) {
        setDocAppointments(data.data);

        // toast.success("Appointment feched")
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const markAppointmentComplete = async (appointmentId) => {
    try {
      const { data } = await axios.patch(
        backendUrl + "/api/doctor/mark-appointment-complete",
        { appointmentId },
        { headers: { doctortoken } }
      );
      if (data.success) {
        getAppointments();
        toast.success("Appointment marked as Completed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.patch(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { doctortoken } }
      );
      if (data.success) {
        getAppointments();
        toast.success("Appointment cancelled");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{doctortoken}})
      if (data.success) {
        setDashData(data.data);
       
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

const getProfileData=async ()=>{
  try {
    const {data}=await axios.get(backendUrl+'/api/doctor/profile',{headers:{doctortoken}})
    if(data.success){
      setProfileData(data.data);
    }else {
      toast.error(data.message);
    }
  } catch (error) {
      console.log(error);
      toast.error(error.message);
  }
}


  const value = {
    doctortoken,
    backendUrl,
    setDoctorToken,
    docAppointments,
    setDocAppointments,
    getAppointments,
    markAppointmentComplete,
    cancelAppointment,
    getDashboardData,
    dashData,
    setDashData,
    profileData,setProfileData,
    getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = () => {
  return useContext(DoctorContext);
};
