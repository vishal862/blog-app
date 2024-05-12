import express from 'express'
import { testApi, updateUser } from "../controllers/user.controller.js";
import {verifyUser} from '../middlewares/verifyUser.js';

const router = express.Router();

router.get('/test',testApi)
router.put('/update/:userId',verifyUser,updateUser)

export default router