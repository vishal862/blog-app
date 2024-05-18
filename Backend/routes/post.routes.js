import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import {
  createPost,
  deletePost,
  getPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getPost", getPost);
router.delete("/deletePost/:postId/:userId",verifyUser, deletePost);

export default router;
