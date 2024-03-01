import express from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";
import taskRouter from "./task.route.js";
import subtaskRouter from "./subtask.route.js";

// AUTH ROUTE

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/signout", signout);



export default authRouter;
