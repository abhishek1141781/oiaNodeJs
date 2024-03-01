import SubTask from "../models/subTask.model.js";
import Task from "../models/task.model.js";

// Utility function to update the status of the corresponding task
export const updateTaskStatus = async (taskId) => {
  try {
    // Find all subtasks associated with the given taskId and whose isDeleted field is false
    const subtasks = await SubTask.find({ task_id: taskId, isDeleted: false });

    // Check if there are any incomplete subtasks (status = 0)
    const hasIncompleteSubtask = subtasks.some(
      (subtask) => subtask.status === 0
    );

    // Find the task associated with the given taskId
    const task = await Task.findById(taskId);

    // Update the status of the task based on the status of its subtasks
    if (hasIncompleteSubtask) {
      // If at least one subtask is incomplete, set the task status to "IN_PROGRESS"
      task.status = "IN_PROGRESS";
    } else {
      // If all subtasks are completed, set the task status to "DONE"
      task.status = "DONE";
    }

    // Save the updated task object
    await task.save();
  } catch (error) {
    throw new Error(error);
  }
};
