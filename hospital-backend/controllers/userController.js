import { ApiError } from "../utils/apiError.js";
import validator from "validator";
import userModel from "../models/userModel.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import {
  uploadFileOnCloudinary
} from "../config/cloudnary.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Fill all the infromation");
    }
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Email should be Correct");
    }
    if (password.length < 8) {
      throw new ApiError(400, "Password must be 8 character long ");
    }
    // hashing the password
    // kitne rounds karne hai
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      throw new ApiError(400, "Error while creating User");
    }
    await user.save();

    // creating the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res
      .status(201)
      .json(new ApiResponse(201, token, "User created successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, error.message);
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Enter all details");
    }
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Enter correct email");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ApiError(400, "No user exist with these credentails ");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res
        .status(200)
        .json(new ApiResponse(200, token, "We found the user successfully"));
    } else {
      throw new ApiError(400, "Error while finding the user");
    }
  } catch (error) {
    console.log(error.message);
    throw new ApiError(400, "Error while loggin user");
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(400, "Error while getting the user Data by UserId");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, error.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // we can get the user id from authuser middleware
    const userId = req.user.id;
    const { name, dob, address, gender, phone } = req.body;
    const image = req.file;

    if (!name || !dob || !address || !gender || !phone) {
      throw new ApiError(400, "Fill the user information to update");
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, dob, gender, phone, address: JSON.parse(address) },
      { new: true }
    );
    if (!updatedUser) {
      throw new ApiError(400, "May be user not exist");
    }
    if (image) {
      //updating the user image
      //first upload on cloud
      const imageUpload = await uploadFileOnCloudinary(image.path);
      if (!imageUpload) {
        throw new ApiError("Error while uplaoding user image");
      }
      //updating image
      updatedUser.image = imageUpload.url;
      await updatedUser.save();
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "user profile updated successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Error in the update user profile function");
  }
};

const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body;

    if (!userId || !docId || !slotDate || !slotTime) {
      return res.json({ status: false, message: "Missing required fields" });
    }

    const docData = await doctorModel
      .findById(docId)
      .select("-password")
      .lean();
    if (!docData.available) {
      return res.json({ status: false, message: "Doctor not available" });
    }

  
    let slots_booked = docData.slots_booked;
    // check the availability for slot
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ status: false, message: "Slots are not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    // delete the slots as we do not want to show history
    delete docData.slots_booked;

    const appointment = await appointmentModel.create(
      {
        userId,
        docId,
        userData,
        docData,
        slotDate,
        slotTime,
        date: Date.now(),
        amount: docData.fee,
      }
    );

    // save new slots data in the doctor data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.status(200).json(new ApiResponse(200,appointment,"Appointment created"))
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Error in creating appointment function",
    });
  }
};

const appointmentList=async (req,res)=>{
  try {
    const userId=req.user.id;
    const data=await appointmentModel.find({userId});
    if(!data){
      throw new ApiError(400,"Error while fetching appointment data");
    }
    return res.status(200).json(new ApiResponse(200,data,"Appointment data"))

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Error in fetching appointment list",
    });
  }
}

const cancelAppointment=async (req,res)=>{
  try {
    // approach->
    // cancel the appointment 
    // also now make the doctor that slot available if we cancel the appointment
    const userId=req.user.id;
    const {appointmentId}=req.body;
    const appointment=await appointmentModel.findById(appointmentId)
    if(appointment.userId!==userId){
      throw new ApiError(400,"Unauthorised action")
    }
    // make the appointment cancellled status ->true
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true,completed:true})
    
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

// for payment -> we have to install the razorpay package || but here i am building a dummy payment which directly  do the paymebnt instead without verify // it is for  demo

const payment=async (req,res)=>{
  try {
    const {appointmentId}=req.body;
    // console.log("appointmentId:",appointmentId);
    const appointment=await appointmentModel.findById(appointmentId); 
    if(!appointment){
      throw new ApiError(400,"Appointment is missing");
    }   
    await appointmentModel.findByIdAndUpdate(appointmentId,{payment:true,isCompleted:true});

    return res.status(200).json(new ApiResponse(200,appointment,"Payment successfull"));

  } catch (error) {
    console.log(error)
    throw new ApiError(400,"Error in payment Function")
  }
}


export {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  bookAppointment,
  appointmentList,
  cancelAppointment,payment
};
