import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const DB_NAME="prescripto"

const connectDB = async () => {
 try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("host name:",connectionInstance.connection.host)
        console.log("DB connected")
    }
    catch(error){
        console.log("Error while connecting to Database:",error);
        // node js functionality function
        process.exit(1);
    }
};

export default connectDB;
