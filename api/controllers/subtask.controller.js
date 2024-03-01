// import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import SubTask from "../models/subTask.model.js";
import { updateTaskStatus } from "../utils/updateTask.js";
import { isThisMySubtask } from "../utils/taskOwnedBy.js";

// SUBTASK CONTROLLER

// export const createSubtask = async (req, res, next) => {
//   // extract task_id from req.body
//   const { task_id } = req.body;
//   const { userId } = req.user.id;

//   // check if the taskID exists else throw error

//   // check if the taskId given is created by the current user itself else throw error

//   // create a new subtask

//   // save it to database and return
//   try {
//   } catch (error) {
//     next(error);
//   }
// };

export const createSubtask = async (req, res, next) => {
  try {
    // console.log("hi");

    // Extract task_id from req.body and userId from req
    const { task_id } = req.body;
    const userId = req.user.id;

    // console.log(task_id + " " + userId);

    // Check if the taskID exists
    const task = await Task.findById(task_id);
    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }

    // console.log(task);

    // Check if the taskId belongs to the current user
    if (task.createdBy.toString() !== userId) {
      return next(errorHandler(403, "Unauthorized access"));
    }

    // Create a new subtask
    const newSubtask = new SubTask({ task_id });

    // Save the subtask to the database
    await newSubtask.save();

    // UPDATE STATUS OF CORRESPONDING TASK
    await updateTaskStatus(newSubtask.task_id);

    // Return the created subtask
    res.status(201).json(newSubtask);
  } catch (error) {
    next(error);
  }
};

// export const getAllSubtasks = async (req, res, next) => {

//     // extract task_id if passed in query param, else fetch all subtasks of current user
// };

export const getAllSubtasks = async (req, res, next) => {
  try {
    // Extract task_id from query parameters, if passed
    const { task_id } = req.query;

    // extract user id
    const userId = req.user.id;

    // some else's task_id: "65e1d105fc584318a05d0b82"
    // my task_id: "65e1de0c3efaeaec4b2838fc"

    // console.log("outside block, all good");

    // IF TASK_ID WAS PASSED ONLY THEN EXECUTE BELOW BLOCK
    // check if task_id is valid & the task belongs to that user itself, else throw error
    if (task_id) {
      //   console.log("inside taskid given block");
      const task = await Task.findById(task_id);
      if (!task) {
        return next(
          errorHandler(404, "Task not found. Give valid task id or NONE AT ALL")
        );
      } else if (task.createdBy.toString() !== userId) {
        return next(
          errorHandler(
            403,
            "Unauthrized access. You can only view subtasks of YOUR OWN TASKS"
          )
        );
      }
    }

    // console.log("after task_id given block");
    // once task_id validated, fetch data accordingly
    if (task_id) {
      // If task_id is provided, fetch all subtasks of the specified task
      const subtasks = await SubTask.find({ task_id });
      res.status(200).json(subtasks);
      // } else {
      //   console.log("no task_id given");
    } else {
      // If no task id is given then get all tasks for the logged in user
      // then iterate and pass each of these task_id to the SubTask model and get subtasks under each task_id and then keep appending them to the final subtasks array

      // If no task_id is given, fetch all tasks of the current user
      const tasks = await Task.find({ createdBy: userId });

      // Initialize an array to store all subtasks
      let allSubtasks = [];

      // Iterate over each task and fetch its subtasks
      for (const task of tasks) {
        const subtasks = await SubTask.find({ task_id: task._id });
        allSubtasks = allSubtasks.concat(subtasks);
      }

      res.status(200).json(allSubtasks);
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE SUBTASK
// export const updateSubtask = async (req, res, next) => {
// extract the subtaskId passed as path variable in url
// check if such a subtask exists, else throw error
// EXTRACT: the updated fields(status field only) from req.body
// get the subtask object and update with new given status value, i hope this is how we update an existing object ? Yeah ?
// WRITE A UTILITY METHOD TO UPDATE THE status OF THE CORRESPONDING TASK(pass it the curent task_id), if and when the current subtask is updated
// 1. set status of the task associated to IN_PROGRESS if at least one subtask has a status of 0
// 2. set status of the task associate to DONE if all subtasks have a status of 1
// check if this subtask is the only subtask of the task_id of which it is a sub task, if yes, ALSO update that task status to DONE
// return the updated subtask object
// };

export const updateSubtask = async (req, res, next) => {
  try {
    // Extract the subtaskId from the URL path parameters
    const { subtaskId } = req.params;

    // Check if the subtask exists
    const subtask = await SubTask.findById(subtaskId);
    if (!subtask) {
      return next(
        errorHandler(
          404,
          "Subtask not found. Please provide a valid subtask ID."
        )
      );
    }

    // // Check if the subtask belongs to the current user
    // isThisMySubtask(subtask.task_id, req.user.id, next);
    // if(!isThisMySubtask){
    //     return next(errorHandler(403, "Unauthorized access"));
    // }

    // check if the current user is the owner of the subtask
    const task = await Task.findById(subtask.task_id);
    // Check if the taskId belongs to the current user
    if (task.createdBy.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access"));
    }

    // console.log("back to main fucntion");

    // Extract the updated fields (status) from the request body
    const { status } = req.body;

    // Update the subtask with the new status value
    subtask.status = status;
    // subtask.updatedAt = Date.now();
    await subtask.save();

    // Update the status of the corresponding task
    await updateTaskStatus(subtask.task_id);

    // Return the updated subtask and task object
    res.status(200).json(subtask);
  } catch (error) {
    next(error);
  }
};

export const deleteSubtask = async (req, res, next) => {
  try {
    // by subtaskID: check if subtask exists and is of current user
    // Extract the subtaskId from the URL path parameters
    const { subtaskId } = req.params;

    // Check if the subtask exists
    const subtask = await SubTask.findById(subtaskId);
    if (!subtask) {
      return next(
        errorHandler(
          404,
          "Subtask not found. Please provide a valid subtask ID."
        )
      );
    }

    // check if the current user is the owner of the subtask
    const task = await Task.findById(subtask.task_id);
    // Check if the taskId belongs to the current user
    if (task.createdBy.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access"));
    }

    // fetch the subtsak object andset isDeleted to true and current dateTIme to deleted_at field
    subtask.isDeleted = true;
    subtask.deleted_at = Date.now();
    await subtask.save();

    // Update the status of the corresponding task
    await updateTaskStatus(subtask.task_id);

    // Return the deleted subtask and task object
    res.status(200).json(subtask);
  } catch (error) {
    next(error);
  }
};
