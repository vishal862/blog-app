import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

export const signUp =async(req,res,next)=>{
    try {
        const {username,email,password} = req.body;
    
        if(!username || !password || !email || username === '' || email === '' || password === ''){
            next(errorHandler(400,'All Fields are required!'))
        }
    
        const existedUser = await User.findOne({username,email});
    
        if(existedUser){
            next(errorHandler(400,'User Exists!'))
        }

        const hashedPassword = await bcryptjs.hash(password,10)
    
        const user = await User.create({
            username,
            email,
            password : hashedPassword
        })
    
        return res.status(200).json({message:'user created successfully',user})
    } catch (error) {
        next(error);
    }
}