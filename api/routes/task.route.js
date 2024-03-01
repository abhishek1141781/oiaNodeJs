import express from "express";
import { createTask, deleteTask, getAllTasks, updateTask } from "../controllers/task.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// TASK ROUTE
const taskRouter = express.Router();

// ENSURE TRY CATCH IN ALL METHODS

// I think the below thing is automateic
// update the updated_at and created_at fields while updating and createing tasks


// 1. create task                ======> DONE
taskRouter.post("/create-task", verifyToken, createTask);
// DOUBT: all users all  tasks or only logged user?                ======> DONE
// 3. get all user tasks(all tasks of current user   Filters ===> priority & dueDate) || Pagination
taskRouter.get("/get-tasks/", verifyToken, getAllTasks);


// UPDATE CORRESPONDING SUBTASKS IN BOTH BELOW CASES               =======> DONE
// 5. update task               =======> DONE
taskRouter.post("/update-task/:taskId", verifyToken, updateTask);
// 7. delete task(softdelete)               =======> DONE
taskRouter.get("/delete-task/:taskId", verifyToken, deleteTask);



export default taskRouter;
