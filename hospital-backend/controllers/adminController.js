import  {uploadFileOnCloudinary}  from "../config/cloudnary.js";
import doctorModel from "../models/doctorModel.js";
import { ApiError } from "../utils/apiError.js";
import bcrypt from "bcrypt"
import ApiResponse from "../utils/apiResponse.js"
import validator from "validator"
import "dotenv/config"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

const addDoctor=async (req,res)=>{
    try {
        const {name,email,password,speciality,degree,experience,fee,about,address}=req.body
        const imageFile=req.file;
        // console.log({name,email,password,speciality,degree,experience,fees,about,imageFile})

        // check that no any data missed 
        if(!name || !email || !password || !speciality || !degree || !experience || !fee || !about){
            throw new  ApiError(400,"Some data is missing while adding doctor")
        }
        // validating email
        if(!validator.isEmail(email)){
              throw new  ApiError(400,"Email is not in the correct format")
        }
        if(password.length<8){
            throw new ApiError(400,"Password should be greater or more than 8 char")
        }

        // hashing the password
        // kitne rounds karne hai 
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        // upload image to cloudinary
        const imageUpload=await  uploadFileOnCloudinary(imageFile.path)
        if(!imageUpload){
            throw new ApiError(400,"Error while uploading Image on cloud")
        }
        const imageUrl=imageUpload.url

        const newDoctor=await doctorModel.create({
            name,
            email,
            password:hashedPassword,
            fee,
            speciality,
            about,
            degree,
            experience,
            image:imageUrl,
            address:JSON.parse(address),
            available:true,
            date:Date.now(),
        })
        // saving the doctor in database 
        await newDoctor.save();
        return res.status(201).json(new ApiResponse(201,newDoctor,"Doctor added successfully"))

    } catch (error) {
        console.log(error)
        return res.status(400).json(new ApiError(400,"Error while adding doctor ||  Doctor already exist"))
    }
}

// admin login 
const adminLogin=async (req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password || password.length<8){
            throw new ApiError(400,"Fill the admin credantails accordingly")
        }
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            return res.status(200).json(new ApiResponse(200,token,"Token is generated"))
        }
        else {
            throw new ApiError(400,"Credentails are not matched")
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json(new ApiError(400,"Error while admin login"))
    }
}

// get all the doctors data 

const getAllDoctors =async (req,res)=>{
    try {
        const doctors=await doctorModel.find({}).select('-password');
        return res.status(200).json(new ApiResponse(200,doctors,"Doctor data fetched successfully"))
    } catch (error) {
        throw new ApiError(400,error.message || "Error while fetching All doctors data")
    }
}

// getting all appointments 
const getAllAppointment=async (req,res)=>{
    try {
        const appointments=await appointmentModel.find({})
        return res.status(200).json(new ApiResponse(200,appointments,"Appointments fetched successfully"))
    } catch (error) {
        console.log(error)
        throw new ApiError(400,"Error while fetching all appointments")
    }
}

// cancel appointment from the admin panel
const cancelAppointment=async(req,res)=>{
try {
    // approach->
    // cancel the appointment 
    // also now make the doctor that slot available if we cancel the appointment
    const {appointmentId}=req.body;
    const appointment=await appointmentModel.findById(appointmentId)
   
    // make the appointment cancellled status ->true
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
    
    // release the doctor slot time 
    const {docId,slotDate,slotTime}=appointment;
    const doctor=await doctorModel.findById(docId);
    let slots_booked=doctor.slots_booked
    slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    return res.status(200).json(new ApiResponse(200,appointment,"Appointment cancelled successfully"))
  } catch (error) {
    console.log(error)
    throw new ApiError(400,"Error in cancel appointment function")
  }
}

// creating api for the dashboard data 

const dashboardData=async (req,res)=>{
    try {
        const doctors=await doctorModel.find({}).select('-password') 
        const appointments=await appointmentModel.find({}).select('-password') 
        const users=await userModel.find({}).select('-password') 
        
        const dasData={
            doctors:doctors.length,
            appointments:appointments.length,
            users:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        return res.status(200).json(new ApiResponse(200,dasData,"Dasboard data is fetched."))
    } catch (error) {
        console.log(error)
        throw new ApiError(400,error.message)
    }
}

export {addDoctor,adminLogin,getAllDoctors,getAllAppointment,cancelAppointment,dashboardData}