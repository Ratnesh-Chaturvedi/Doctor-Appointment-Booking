import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import doctorModel from "../models/doctorModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctor.available,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Availability change successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Error while changing the availablity");
  }
};

const doctorList = async (req, res) => {
  try {
    const doctor = await doctorModel.find({}).select(["-password", "-email"]);
    if (!doctor) {
      throw new ApiError(400, "Error while getting doctors data");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Doctors data fetched successfully"));
  } catch (error) {
    throw new ApiError(400, "Error while fetching all the doctors");
  }
};

//login the doctor for the doctor dashboard

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Enter all details");
    }
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Enter correct email");
    }
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      throw new ApiError(400, "No doctor exist with these credentails ");
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      //generating the token
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      console.log(token);
      return res
        .status(200)
        .json(new ApiResponse(200, token, "We found the doctor successfully"));
    } else {
      throw new ApiError(400, "Error while finding the doctor");
    }
  } catch (error) {
    // console.log(error)
    throw new ApiError(400, error.message);
  }
};

//get the all the appointments of specific doctor

const getAppointments = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const appointments = await appointmentModel.find({ docId });
    if (!appointments) {
      throw new ApiError(
        400,
        "Error while fetching appointment of specific doctor"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, appointments, "Appointment are fetched"));
  } catch (error) {
    // console.log(error)
    throw new ApiError(400, error.message);
  }
};

// mark the appointment as completed

const markAppointmentComplete = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      appointmentData.isCompleted = true;
      appointmentData.payment=true;
      await appointmentData.save();
      return res
        .status(200)
        .json(new ApiResponse(200, appointmentData, "Appointment completed"));
    } else {
      throw new ApiError(400, "Mark appointment completion failed");
    }
  } catch (error) {
    // console.log(error)
    throw new ApiError(400, error.message);
  }
};

//cancel appointment from the doctor side
const cancelAppointment = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      appointmentData.cancelled = true;
      // if the doctor cancelled the appointment then we have to again free up the slot so that other can book that slot -> my suggestion
      const doctor = await doctorModel.findById(docId);
      const { slotDate, slotTime } = appointmentData;
      let slots_booked = doctor.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
      await appointmentData.save();
      return res
        .status(200)
        .json(new ApiResponse(200, appointmentData, "Appointment cancelled"));
    } else {
      throw new ApiError(400, "Cancelling appointment  failed");
    }
  } catch (error) {
    // console.log(error)
    throw new ApiError(400, error.message);
  }
};

// function for the doctor dashboard data
const dashboardData = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const appointment = await appointmentModel.find({ docId });
    let earning = 0;
    appointment.map((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });

    // count different number of patients
    let patients = [];
    appointment.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      appointmentCount: appointment.length,
      earning: earning,
      patients: patients.length,
      latestAppointments: appointment.reverse().slice(0, 5),
    };

    return res
      .status(200)
      .json(new ApiResponse(200, dashData, "Dashboard data fetched  "));
  } catch (error) {
    // console.log(error)
    throw new ApiError(400, error.message);
  }
};

// function for doctor profile so they can make changes

const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const doctor = await doctorModel.findById(docId).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, doctor, "Doctor fetched successfully"));
  } catch (error) {
    // console.log(error)
    throw new ApiError(400, error.message);
  }
};

const updateDoctorProfile=async (req,res)=>{
  try {
    const docId = req.doctor.id;
    const {fee,available,address}=req.body;
    const updatedDoctor=await doctorModel.findByIdAndUpdate(docId,{fee,available,address})

    return res.status(200).json(new ApiResponse(200,updatedDoctor,"Doctor profile updated"))
  } catch (error) {
    // console.log(error)
    throw new ApiError(400, error.message);
  }
}


export {
  changeAvailability,
  doctorList,
  doctorLogin,
  getAppointments,
  markAppointmentComplete,
  cancelAppointment,
  dashboardData,
  doctorProfile,
  updateDoctorProfile
};
