import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('⚙️ mongodb connected');
}).catch((error)=>{
    console.log("connection error❌");
})

app.listen(3000,()=> {
    console.log("app is listening on port 3000")
})