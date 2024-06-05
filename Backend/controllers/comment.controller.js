import { Comment } from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js"

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