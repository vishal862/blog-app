import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs'

export const signUp =async(req,res)=>{
    try {
        const {username,email,password} = req.body;
    
        if(!username || !password || !email || username === '' || email === '' || password === ''){
            return res.status(400).json({message:'all fields are required'})
        }
    
        const existedUser = await User.findOne({username,email});
    
        if(existedUser){
            return res.status(500).json({message:'use exist'});
        }

        const hashedPassword = await bcryptjs.hash(password,10)
    
        const user = await User.create({
            username,
            email,
            password : hashedPassword
        })
    
        return res.status(200).json({message:'user created successfully',user})
    } catch (error) {
        res.status(500).json(error.message || 'internal server error')
    }
}