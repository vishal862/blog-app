import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoute from '../Backend/routes/user.routes.js'
import authRoute from '../Backend/routes/auth.routes.js'
import postRoute from '../Backend/routes/post.routes.js'
import commentRoute from '../Backend/routes/comment.routes.js'
import cookieParser from 'cookie-parser';
import path from 'path'

const app = express();
dotenv.config();

const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())

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
app.use('/api/post',postRoute);
app.use('/api/comment',commentRoute);

app.use(express.static(path.join(__dirname,'/Frontend/dist')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'Frontend','dist','index.html'))
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})