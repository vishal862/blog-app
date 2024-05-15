import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import { createPost, getPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getPost", getPost);

export default router;
