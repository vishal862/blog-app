import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  likeComment,
  showComments,
} from "../controllers/comment.controller.js";
import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createComment);
router.get("/showComments/:postId", showComments);
router.put("/likeComment/:commentId",verifyUser,likeComment);
router.put("/editComment/:commentId",verifyUser,editComment);
router.delete("/deleteComment/:commentId",verifyUser,deleteComment);
router.get("/getComments",verifyUser,getComments);

export default router;
