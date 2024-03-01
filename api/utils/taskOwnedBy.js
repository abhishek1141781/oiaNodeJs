import Task from "../models/task.model.js";
import { errorHandler } from "./error.js";

export const isThisMySubtask = async (subtaskId, userId, next) => {
  // check if the current user is the owner of the task
  const task = await Task.findById(subtaskId);
  // Check if the taskId belongs to the current user
  if (task.createdBy.toString() !== userId) {
    return next(errorHandler(403, "Unauthorized access"));
  }
  console.log("is this my subtasksssskkkkkkkkkkkk enddddddddddddddddddddd");
};
