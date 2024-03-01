import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";
import subtaskRouter from "./routes/subtask.route.js";
// import path from 'path';

dotenv.config();


const app = express();

app.use(express.json());

app.use(cookieParser());

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("connected to mongoose db");
})
.catch((err) => {
  console.log(err);
});

// FOR DEPLOYMENT ON RENDER
// const __dirname = path.resolve();

app.listen(3000, () => {
  console.log("server runing on 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// task routes
app.use("/api/auth/user/task", taskRouter);
// subtaskroutes
app.use("/api/auth/user/task/subtask", subtaskRouter);






// FOR DEPLOYMENT ON RENDER
// app.use(express.static(path.join(__dirname,'/client/dist')))
// app.get('*',(req,res) => {
//   res.sendFile(path.join(__dirname,'client', 'dist', 'index.html'))
// })

// error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error: default";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
