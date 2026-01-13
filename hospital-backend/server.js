import express from 'express'
import cors from "cors"
import "dotenv/config"
import connectDB from './config/mongodb.js'

const app=express()
const port=process.env.PORT || 4000
app.use(express.json())

connectDB();


app.use(cors())

// api endpoint 
import adminRouter from './routes/adminroute.js'
import doctorRouter from "./routes/doctorroute.js"
import userRouter from './routes/userroute.js'
// routes 
app.use("/api/admin",adminRouter)
app.use("/api/doctor",doctorRouter)
app.use("/api/user",userRouter)


app.get("/",(req,res)=>{
   res.send("Api working ")
})

app.listen(port,()=>{console.log("server started at port",port)})