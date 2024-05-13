import express from 'express'
import { deleteUser, testApi, updateUser } from "../controllers/user.controller.js";
import {verifyUser} from '../middlewares/verifyUser.js';

const router = express.Router();

router.get('/test',testApi)
router.put('/update/:userId',verifyUser,updateUser)
router.delete('/delete/:userId',verifyUser,deleteUser)

export default router