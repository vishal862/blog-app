import jwt from 'jsonwebtoken'
import {errorHandler} from '../utils/error.js'

export const verifyUser = async (req,_,next)=>{
    const token = req.cookies.access_token;

    // console.log(token);

    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401,'Unauthorized'))
        }
        req.user = user;
        next();
    })
}