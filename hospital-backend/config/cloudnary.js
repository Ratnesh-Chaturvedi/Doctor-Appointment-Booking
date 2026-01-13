import {v2 as cloudinary} from "cloudinary"
import { config } from "dotenv";
import { ApiError } from "../utils/apiError.js";
import fs from "fs"

  cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_SECRET_KEY,
  });


const uploadFileOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto" // automatically detect the type of file uploaded
    });
    // console.log("file uploaded successfully:", response.url);
    fs.unlinkSync(localfilepath); // remove the locally saved temporary file
    return response;
  } catch (error) {
    // remove the locally saved temporary file as upload operation got failed
    fs.unlinkSync(localfilepath);
    return null;
  }
};

// this works for both image and video
const deleteFIleFromCloudinary=async (imagePath) =>{
  try {
    if(!imagePath){
      throw new ApiError(400,"Image id is not correct")
    }
    // extract the url 
    const imageActualUrl=extractPublicId(imagePath)
    const response=await cloudinary.uploader.destroy(imageActualUrl)

    if(response.result!=="ok"){
      throw new ApiError(400,"Error while deleting the file")
    }
    return true;
  } catch (error) {
    throw new ApiError(400,error.message,"There is something uneven while deleting the file may be url is incorrect")
    
  }
}



export  {uploadFileOnCloudinary,deleteFIleFromCloudinary};