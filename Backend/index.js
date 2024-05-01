import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoute from '../Backend/routes/user.routes.js'
import authRoute from '../Backend/routes/auth.routes.js'

const app = express();
dotenv.config();

app.use(express.json())

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('⚙️ mongodb connected');
}).catch((error)=>{
    console.log("connection error❌");
})

app.listen(3000,()=> {
    console.log("app is listening on port 3000")
})

app.use('/api/user',userRoute);
app.use('/api/auth',authRoute);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})