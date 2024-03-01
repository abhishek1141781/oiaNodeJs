import express from "express";
import {
  createSubtask,
  deleteSubtask,
  getAllSubtasks,
  updateSubtask,
} from "../controllers/subtask.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// SUBTASK ROUTE
const subtaskRouter = express.Router();

// ENSURE TRY CATCH IN ALL METHODS

// update the updated_at and created_at fields while updating and createing subtasks
// this is automatic i guess

// CREATE UTILITY FUNCTION FOR FOLLOWING
// 1. IF SUBTASK ID EXISTS AND IS OF CURRENT USER
// 2. IF TASK ID EXISTS AND IS OF CURRENT USER
// 3. AND OTHER REPETITIVE TASKS

// 2. create subtask                ======> DONE
subtaskRouter.post("/create-subtask", verifyToken, createSubtask);
// REMAINING:                ======> DONE
// 6. after a subtask is updated, fetch all subtasks of the asssociated task and check the no of subtasks with status===0 and isDeleted=false, if there is at least one of them update status to IN_PROGRESS, if NONE are like these and count is ZERO update task status to DONE

// 4. get all user subtasks(filter of task_id)                ======> DONE
subtaskRouter.get("/get-subtasks/", verifyToken, getAllSubtasks);

// 6. update subtask(only status to be updated)                 =====> DONE
subtaskRouter.post("/update-subtask/:subtaskId", verifyToken, updateSubtask);
// REMAINING:                   ==========> DONE
// 6. after a subtask is updated, fetch all subtasks of the asssociated task and check the no of subtasks with status===0 and isDeleted=false, if there is at least one of them update status to IN_PROGRESS, if NONE are like these and count is ZERO update task status to DONE

// 8. Delete subtask                =========>DONE
subtaskRouter.get("/delete-subtask/:subtaskId", verifyToken, deleteSubtask);
// REMAINING:                =========>DONE
// 6. after a subtask is updated, fetch all subtasks of the asssociated task and check the no of subtasks with status===0 and isDeleted=false, if there is at least one of them update status to IN_PROGRESS, if NONE are like these and count is ZERO update task status to DONE

export default subtaskRouter;
