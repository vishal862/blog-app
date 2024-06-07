import { Comment } from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js"
import {User} from "../models/user.model.js"

export const createComment = async (req,res,next)=>{
    try {
        const {content,postId,userId} = req.body;
    
        if(!content || !postId || !userId){
            return next(errorHandler(403,"all fields are required"));
        }
    
        const comment = await Comment.create({
            content,
            postId,
            userId
        });
    
        return res.status(200).json({comment})

    } catch (error) {
        next(error);
    }
}

export const showComments = async (req,res,next)=>{
    const {postId} = req.params;

    const comments = await Comment.find({postId}).sort({createdAt : -1})

    if(!comments){
        return next(errorHandler(404,'comments not found!'));
    }
    
    return res.status(200).json(comments);
}