import express from "express";
import {
  test,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.get("/:id", verifyToken, getUser);

export default userRouter;
