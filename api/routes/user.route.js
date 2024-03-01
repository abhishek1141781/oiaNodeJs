import express from "express";
import {
  test,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// USER ROUTE
const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.get("/:id", verifyToken, getUser);

export default userRouter;
