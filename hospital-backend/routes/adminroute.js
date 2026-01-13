import express, { Router } from "express"
import {upload} from "../middleware/multer.js"
import { addDoctor, adminLogin, getAllDoctors,getAllAppointment,cancelAppointment,dashboardData } from "../controllers/adminController.js"
import authAdmin from "../middleware/authAdmin.js"
import { changeAvailability } from "../controllers/doctorController.js"

const adminRouter=express.Router()

adminRouter.post("/add-doctor",authAdmin,upload.single("image"),addDoctor)
adminRouter.post("/login",adminLogin)
adminRouter.get('/all-doctors',authAdmin,getAllDoctors);
adminRouter.patch('/change-availability',authAdmin,changeAvailability);
adminRouter.get('/all-appointments',authAdmin,getAllAppointment)
adminRouter.patch('/cancel-appointment',authAdmin,cancelAppointment)
adminRouter.get('/dasboard-data',authAdmin,dashboardData)
export default adminRouter
