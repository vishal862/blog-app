import { Comment } from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (!content || !postId || !userId) {
      return next(errorHandler(403, "all fields are required"));
    }

    const comment = await Comment.create({
      content,
      postId,
      userId,
    });

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
    return res.status(200).json(comment)
  } catch (error) {
    next(error);
  }
};
