import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";
import subtaskRouter from "./routes/subtask.route.js";
import { dailyPriorityUpdateBasedOnDueDate, startVoiceCallCron } from "./cronJobs/dailyCron.js";

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

app.listen(3000, () => {
  console.log("server runing on 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// task routes
app.use("/api/auth/user/task", taskRouter);
// subtaskroutes
app.use("/api/auth/user/task/subtask", subtaskRouter);


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


// Called function to start the cron job
dailyPriorityUpdateBasedOnDueDate(next => {});
startVoiceCallCron(next => {});