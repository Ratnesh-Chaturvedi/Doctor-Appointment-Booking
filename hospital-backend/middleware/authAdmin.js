import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js";
import "dotenv/config"
const authAdmin = async (req,res,next)=>{
    try {
        // always make the header key in lowercase // warna error aayegaa
        const {authtoken}=req.headers
        if(!authtoken){
            throw new ApiError(400,"Invalid admin auth token");
        }
        const decodedToken=  jwt.verify(authtoken,process.env.JWT_SECRET)
        if(decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            throw new ApiError(400,"Decoded token not matched with auth token")
        }
        next();
    } catch (error) {
        console.log(error.message)
        throw new ApiError(400,"Invalid admin authorization");
        
    }
}

export default authAdmin;