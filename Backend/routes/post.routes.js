import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getPost", getPost);
router.delete("/deletePost/:postId/:userId",verifyUser, deletePost);
router.put("/updatePost/:postId/:userId",verifyUser,updatePost)

export default router;
