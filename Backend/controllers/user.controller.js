import {errorHandler} from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import {User} from '../models/user.model.js'

export const testApi = async (req,res)=>{
    res.json({msg:'working'});
}

export const updateUser = async (req,res,next)=>{
    if(req.user.id !== req.params.userId){
        return next(errorHandler(400,'You can not update this user unless he is your father'))
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400,'Be smart pal! enter a big ass password'))
        }

        req.body.password = bcryptjs.hashSync(req.body.password,10);
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400,'username must be between 2 and 22 characters'))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400,'seriously bro? who puts spaces in the username?'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400,"don't be oversmart bro, just use letters and numbers nothin else!"))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400,'be grown up bro, you seriously do not know how a username looks like?'))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId,{
            $set : {
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                profilePicture : req.body.profilePicture
            }
        },{new : true})
    
        const{password , ...rest} = updatedUser._doc;
    
        return res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req,res,next)=>{
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(400,'You can not update this user unless he is your dad'))
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        return res.status(200).json('user has been deleted!')
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req,res,next)=>{
  try {
    return res.clearCookie('access_token').status(200).json('User signed out successfully!')
  } catch (error) {
    next(error);
  }
}

export const getUsers = async (req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(400,'You are not allowed to see the users'))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 0;
        const sortDirections = (req.query.order) === 'asc' ? 1 : -1;

        const users = await User.find()
        .sort({createdAt : sortDirections})
        .skip(startIndex)
        .limit(limit)
        .select(["-password"])

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        )

        const lastMonthUsers = await User.countDocuments({
            createdAt : {
                $gte : oneMonthAgo
            }
        })

        return res.status(200).json({
            users,
            totalUsers,
            lastMonthUsers
        })
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req,res,next)=>{
    try {
        const {userId} = req.params;
    
        const user = await User.findById(userId).select(["-password"]);
    
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}