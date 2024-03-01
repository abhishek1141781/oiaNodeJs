import express from "express";
import { signin, signout, signup, test } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/signout", signout);
authRouter.get("/test", test);


export default authRouter;
