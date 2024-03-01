// import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Task from "../models/task.model.js";
import { setTaskPriority } from "../utils/priority.js";
import {
  updateSubtaskStatusOnTaskUpdate,
  updateSubtaskStatusOnTaskDelete,
} from "../utils/updateSubtask.js";

export const createTask = async (req, res, next) => {
  try {
    // Extract information from request body
    const { title, description, due_date } = req.body;

    // Check if task with the same title exists
    const taskExists = await Task.findOne({ title });
    if (taskExists) {
      return next(errorHandler(400, "Duplicate task. Task exists already!!!"));
    }

    // check if due date is today or after today
    // Check if due_date is after today's date and its format is correct
    if (due_date) {
      const dueDate = new Date(due_date);
      if (isNaN(dueDate) || dueDate < new Date()) {
        return next(
          errorHandler(
            400,
            "Invalid due_date. Please provide a valid date of today or after today."
          )
        );
      }
    }

    // Initialize priority of task according to due date
    const priority = setTaskPriority(new Date(due_date));

    // Create new task object
    const newTask = new Task({
      title,
      description,
      due_date,
      priority,
      createdBy: req.user.id,
    });

    // Save new task to the database
    await newTask.save();

    // Send success response with created task data
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};



export const getAllTasks = async (req, res, next) => {
  try {
    // Extract all query parameters
    const {
      due_date = new Date().toISOString(),
      priority = 0,
      pageNum = 1,
      pageSize = 3,
    } = req.query;

    // check if user entered due_date is valid DateString, priority is a number between 0-3, and the pageNum and pageSize are numbers
    // Check if user-entered due_date is a valid DateString
    if (isNaN(Date.parse(due_date))) {
      return next(
        errorHandler(
          400,
          "Invalid due_date. Please provide a valid date string."
        )
      );
    }

    // Check if priority is a number between 0 and 3
    const priorityNumber = parseInt(priority);
    if (isNaN(priorityNumber) || priorityNumber < 0 || priorityNumber > 3) {
      return next(
        errorHandler(
          400,
          "Invalid priority. Please provide a number between 0 and 3."
        )
      );
    }

    // Convert page number and page size to integers
    const pageNumber = parseInt(pageNum);
    const pageSizeNumber = parseInt(pageSize);

    // Check if pageNum and pageSize are valid numbers
    if (
      isNaN(pageNumber) ||
      isNaN(pageSizeNumber) ||
      pageNumber < 1 ||
      pageSizeNumber < 1
    ) {
      return next(
        errorHandler(
          400,
          "Invalid pageNum or pageSize. Please provide valid positive integers"
        )
      );
    }

    // Get current user's ID
    const userId = req.user.id;

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * pageSizeNumber;

    // Search for tasks based on filters and user ID
    const tasks = await Task.find({
      createdBy: userId,
      due_date: { $lte: due_date },
      priority: { $lte: priority },
    })
      .sort({ due_date: 1 }) // Sort tasks by due date in ascending order
      .skip(skip)
      .limit(pageSizeNumber);

    // Return paginated results
    res.status(200).json({ tasks, page: pageNumber, pageSize: pageSizeNumber });
  } catch (error) {
    next(error);
  }
};


export const updateTask = async (req, res, next) => {
  try {
    // Extract the task ID from the URL path parameters
    const { taskId } = req.params;

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return next(
        errorHandler(404, "Task not found. Please provide a valid task ID.")
      );
    }

    // Check if the task belongs to the current user
    if (task.createdBy.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access"));
    }

    // Extract the data sent by the user in req.body
    const { due_date, status } = req.body;

    // Validate the incoming data sent by the user
    // Check if due_date is after today's date and its format is correct
    if (due_date) {
      const newDueDate = new Date(due_date);
      if (isNaN(newDueDate) || newDueDate < new Date()) {
        return next(
          errorHandler(
            400,
            "Invalid due_date. Please provide a valid date of today or after today."
          )
        );
      }
    }

    // Check if status is one of "TODO" or "DONE" but not "IN_PROGRESS"
    if (status && !["TODO", "DONE"].includes(status)) {
      return next(
        errorHandler(400, "Invalid status. Please provide 'TODO' or 'DONE'.")
      );
    }

    // Update fields that were provided
    task.due_date = due_date || task.due_date;
    task.status = status || task.status;

    // set new updated priority after new due_date
    await setTaskPriority(task.due_date);

    // Save the updated task to the database
    await task.save();

    // Update the status of the corresponding subtasks
    // await updateSubtaskStatus(task._id);
    // CREATE A UTILITY METHOD: pass it the taskID
    // 1. status can only be updated to TODO or DONE=> if it's TODO, set all nonDeleted subtasks statuses to 0, if its DONE, set all nonDeleted subtask statuses to 1
    // 2. update new task priority based on new due_date
    await updateSubtaskStatusOnTaskUpdate(task._id, task.status);

    // Return the updated task object
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    // by taskID: check if task exists and is of current user
    // Extract the taskId from the URL path parameters
    const { taskId } = req.params;

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return next(
        errorHandler(404, "Task not found. Please provide a valid task ID.")
      );
    }

    // check if the current user is the owner of the task
    // Check if the taskId belongs to the current user
    if (task.createdBy.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access"));
    }

    // fetch the tsak object and set isDeleted to true and current dateTIme to deleted_at field
    task.isDeleted = true;
    task.deleted_at = Date.now();
    await task.save();

    // Update the status of the corresponding subtasks
    await updateSubtaskStatusOnTaskDelete(task._id);

    // Return the deleted task object
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
