import express from "express";
import {
  deleteUser,
  getUsers,
  signOut,
  testApi,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.get("/test", testApi);
router.put("/update/:userId", verifyUser, updateUser);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.post("/signout", signOut);
router.get("/getUsers",verifyUser,getUsers)
export default router;
