import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js";
import "dotenv/config"
const authUser = async (req,res,next)=>{
    try {
        // always make the header key in lowercase // warna error aayegaa
        const {usertoken}=req.headers
        if(!usertoken){
            throw new ApiError(400,"Invalid user auth token");
        }
        // console.log("token is :",usertoken)
        const decodedToken=  jwt.verify(usertoken,process.env.JWT_SECRET)
        // console.log(decodedToken, decodedToken.id);
        req.user={id:decodedToken.id};
        next();
    } catch (error) {
        console.log(error.message)
        throw new ApiError(400,"Invalid user authorization");
        
    }
}

export default authUser;