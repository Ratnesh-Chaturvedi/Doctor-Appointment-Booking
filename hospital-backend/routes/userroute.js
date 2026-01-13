import express , {Router } from "express"
import { registerUser,loginUser,getProfile, updateUserProfile,bookAppointment ,appointmentList,cancelAppointment,payment} from "../controllers/userController.js"
import authUser from "../middleware/userAuth.js"
import {upload} from "../middleware/multer.js"
const userRouter=express.Router()


userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/get-profile",authUser,getProfile)
// single ke under field name aayega 
userRouter.patch("/update-profile",upload.single("image"),authUser,updateUserProfile)
userRouter.post("/book-appointment",authUser,bookAppointment)
userRouter.get('/appointments',authUser,appointmentList)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.patch('/payment',authUser,payment)
export default userRouter