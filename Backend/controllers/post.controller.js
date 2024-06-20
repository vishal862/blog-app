import { Post } from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(400, "you are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "All fields are required"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  try {
    const post = await Post.create({
      ...req.body,
      //...req.body is same as
      //title: req.body.title,
      //content: req.body.content,
      slug,
      userId: req.user.id,
    });
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirections = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      //(use of spread op) means it kind of like it checks if a userId is present or not if present it stores in an
      // object and then it checks if category is present or not if it is then it remembers the previous
      // entry of userId and alongside it stores the category and so on

      // (userId: req.query.userId } userId is already present in db so we are matching it with
      // userid from query if it matches then it would be included in find to help search for
      // that specific user id

      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          {
            title: {
              $regex: req.query.searchTerm,
              $options: "i",
            },
          },
          {
            content: {
              $regex: req.query.searchTerm,
              $options: "i",
            },
          },
        ],
      }),
    })
      .sort({ updatedAt: sortDirections })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: {
        $gte: oneMonthAgo,
      },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
    // console.log(req.user.isAdmin);
    // console.log(req.params.userId);
    // console.log(req.user.id);
    if(!req.user.isAdmin || req.user.id !== req.params.userId ){
        return next(errorHandler(400,"This user is not allowed to delete the post!"))
    }

   try {
     await Post.findByIdAndDelete(req.params.postId);
 
     return res.status(200).json('post deleted successfully')
   } catch (error) {
    return next(error)
   }
};

export const updatePost = async (req,res,next) =>{
  console.log(req.user.isAdmin );
  console.log(req.user.id );
  console.log(req.params.userId);
  if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(errorHandler(400,"This user is not allowed to delete the post!"))
  }
  try {
    const updatedUser = await Post.findByIdAndUpdate(req.params.postId,{
      $set : {
        title : req.body.title,
        content : req.body.content,
        category : req.body.category,
        image : req.body.image,
      }
    },{new : true})

    return res.status(200).json(updatedUser)
  } catch (error) {
    next(error);
  }
}