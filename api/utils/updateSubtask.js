import SubTask from "../models/subTask.model.js";

// Utility function to update the status of corresponding subtasks
export const updateSubtaskStatusOnTaskUpdate = async (taskId, taskStatus) => {
  try {
    // Find all non-deleted subtasks associated with the given taskId
    const task = await SubTask.find({ task_id: taskId, isDeleted: false });

    // Determine the new status based on the task status
    let newSubtaskStatus = 0; // Default status is TODO
    if (taskStatus === "DONE") {
      newSubtaskStatus = 1; // If task status is DONE, set subtask status to 1
      // Update the status of all non-deleted subtasks
      await SubTask.updateMany(
        { task_id: taskId, isDeleted: false },
        { status: newSubtaskStatus }
      );
    } else if (taskStatus === "TODO") {
      await SubTask.updateMany(
        { task_id: taskId, isDeleted: false },
        { status: newSubtaskStatus }
      );
    }
  } catch (error) {
    // Handle errors if any
    console.error("Error updating subtask status:", error);
    throw new Error(error);
  }
};

export const updateSubtaskStatusOnTaskDelete = async (taskId) => {
  try {
    // Get the current timestamp
    const deletedAt = new Date();

    // Update all subtasks that are not deleted and have this taskId as deleted
    await SubTask.updateMany(
      { task_id: taskId, isDeleted: false },
      { isDeleted: true, deleted_at: deletedAt }
    );
  } catch (error) {
    // If an error occurs, throw a new error with the original error message
    throw new Error(error);
  }
};
