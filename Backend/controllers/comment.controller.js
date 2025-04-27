import { Comment } from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    console.log(content);
    

    if (!content || !postId || !userId) {
      return next(errorHandler(403, "all fields are required"));
    }

    const comment = await Comment.create({
      content,
      postId,
      userId,
    });

    console.log(comment);
    
    return res.status(200).json({ comment });
  } catch (error) {
    next(error);
  }
};

export const showComments = async (req, res, next) => {
  const { postId } = req.params;

  const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

  if (!comments) {
    return next(errorHandler(404, "comments not found!"));
  }

  return res.status(200).json(comments);
};

export const likeComment = async (req, res, next) => {
  const { commentId } = req.params;

  if (!commentId) {
    return next(errorHandler(404, "comment not found!"));
  }

  try {
    const comment = await Comment.findById(commentId);

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
      return next(errorHandler(404, "comment not found"));
    }

    if (!content) {
      return next(errorHandler(400, "please enter the content"));
    }

    let comment = await Comment.findById(commentId);
    console.log(comment);

    if (req.user.id !== comment.userId && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You do not have permission to edit this comment")
      );
    }
    comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content: content,
      },
      { new: true }
    );

    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req,res,next) => {
  try {
    const { commentId } = req.params;
  
    const comment = await Comment.findById(commentId);
  
    if((req.user.id !== comment.userId) && !req.user.isAdmin){
      return next(errorHandler(403,'you are not allowed to delete the comment!'))
    }
  
    await Comment.findByIdAndDelete(comment);
  
    return res.status(200).json('deleted!');
  } catch (error) {
    next(error);
  }
}

export const getComments = async (req,res,next) => {
  if(!req.user.isAdmin){
    return next(errorHandler(403,'you are not allowed to get the comments!'))
  }
  try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
      const comments = await Comment.find()
      .sort({createdAt : sortDirection})
      .skip(startIndex)
      .limit(limit)

      const totalComments = await Comment.countDocuments();

      const now = new Date();

      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate()
      )
      const commentsOfLastMonth = await Comment.countDocuments({
        createdAt : {
          $gte : oneMonthAgo
        }}
      )

      return res.status(200).json({
        comments,
        totalComments,
        commentsOfLastMonth
      })
  } catch (error) {
    next(error);
  }
}