import { Post } from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const createPost = async (req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(400,'you are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,'All fields are required'))
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');

   try {
     const post = await Post.create({
         ...req.body,
         slug,
         userId : req.user.id
     })
     return res.status(200).json(post)
   } catch (error) {
    next(error)
   }

}