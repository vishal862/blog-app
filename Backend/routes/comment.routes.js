import {
  createComment,
  likeComment,
  showComments,
} from "../controllers/comment.controller.js";
import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createComment);
router.get("/showComments/:postId", showComments);
router.put("/likeComment/:commentId",verifyUser,likeComment)

export default router;
