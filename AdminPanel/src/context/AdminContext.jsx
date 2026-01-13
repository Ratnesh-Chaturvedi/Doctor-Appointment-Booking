import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AdminContext = createContext();

export const AdminContextProvider = (props) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || ""
  );
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [appointments,setAppointments]=useState([])
  const [doctors, setDoctors] = useState([]);
  const [dashboardData,setDashboardData]=useState(false);
  const getAllDoctorsData = async () => {
    try {
      const {data}=await axios.get(backendUrl+'/api/admin/all-doctors',{headers:{authToken}})
      if (data.success) {
        setDoctors(data.data);
        // console.log(data.data);
        // console.log(doctors)
      } 
    } catch (error) {
      // toast.error(error.message);
      console.log("Error Aya",error.message)
    }
  }

const   changeAvailability=async(docId)=>{
    try {
        const {data}=await axios.patch(backendUrl+'/api/admin/change-availability',{docId},{headers:{authToken}})
        if(data.success){
          // here the availability change so we have to call the getAllDoctorsData so that the data should be updated
          // console.log("this is executed ")
          getAllDoctorsData();
         toast.success("Availability changed successfully")
        }
       
    } catch (error) {
        // console.log(error)
        toast.error("Error occured During changing availability")
    }
}

// function to get all the appointments which are booked by all users
const getAllAppointments=async ()=> {
  try {
    const {data}=await axios.get(backendUrl+'/api/admin/all-appointments',{headers:{authToken}})
    if(data.success){
      setAppointments(data.data.reverse())
    }
    else {
      toast.error(data.message)
    }
  } catch (error) {
    // console.log(error)
    toast.error(error.message)
  }
}

const cancelAppointment=async (appointmentId)=>{
  try {

    const {data}=await axios.patch(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{authToken}})
    if(data.success){
      getAllAppointments();
      getDasboardData();
      toast.success("Appointment Cancelled Successfully")
    }
    else {
      toast.error(data.message)
    }
  } catch (error) {
    // console.log(error)
    toast.error(error.message)
  }
}

const getDasboardData=async ()=>{
  try {
    const {data}=await axios.get(backendUrl+'/api/admin/dasboard-data',{headers:{authToken}})
    if(data.success){
      // toast.success("Dasboard data fetched") 
      setDashboardData(data.data)
    }
    else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}

  const value = {
    authToken,
    setAuthToken,
    backendUrl,
    getAllDoctorsData,
    doctors,
    setDoctors,
    changeAvailability,
    appointments,setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashboardData,
    getDasboardData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};
