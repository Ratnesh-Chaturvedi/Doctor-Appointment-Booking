import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js";
import "dotenv/config"

const authDoctor = async (req,res,next)=>{
    try {
        // always make the header key in lowercase // warna error aayegaa
        const {doctortoken}=req.headers
        if(!doctortoken){
            throw new ApiError(400,"Invalid user auth token");
        }
        // console.log("token is :",doctortoken)
        const decodedToken=  jwt.verify(doctortoken,process.env.JWT_SECRET)
        // console.log(decodedToken, decodedToken.id);
        req.doctor={id:decodedToken.id};
        next();
    } catch (error) {
        console.log(error.message)
        throw new ApiError(400,"Invalid doctor authorization");
        
    }
}

export default authDoctor;