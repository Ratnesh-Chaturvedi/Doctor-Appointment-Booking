import express, { Router } from "express"
import { doctorList, doctorLogin,getAppointments,markAppointmentComplete ,cancelAppointment,dashboardData,doctorProfile,updateDoctorProfile} from "../controllers/doctorController.js";
import authDoctor from "../middleware/doctorAuth.js";


const doctorRouter=express.Router();

doctorRouter.get("/list",doctorList);
doctorRouter.post('/login',doctorLogin)
doctorRouter.get('/doc-appointments',authDoctor,getAppointments)
doctorRouter.patch('/mark-appointment-complete',authDoctor,markAppointmentComplete)
doctorRouter.patch('/cancel-appointment',authDoctor,cancelAppointment)
doctorRouter.get('/dashboard',authDoctor,dashboardData)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.patch('/update-profile',authDoctor,updateDoctorProfile)

export default doctorRouter 