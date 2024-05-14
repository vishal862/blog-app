import express from 'express'
import { verifyUser } from '../middlewares/verifyUser.js';
import { createPost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create',verifyUser,createPost)

export default router;