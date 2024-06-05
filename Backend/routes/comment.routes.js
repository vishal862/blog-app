import { createComment } from "../controllers/comment.controller.js";
import express from 'express';
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post('/create',verifyUser,createComment)

export default router